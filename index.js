const fs      = require('fs')
const yaml    = require('js-yaml')
const merge   = require('lodash.merge')
const ora     = require('ora')()
const axios   = require('axios')
const Octokit = require('@octokit/rest')

function __asyncIter(iterable, fn) {
  return iterable.reduce(async (previousPromise, current)=> {
    let previous = await previousPromise
    let result = await fn(current, previous)
    return [...previous, result]
  }, Promise.resolve([]))
}

async function run(_confPath) {
  const settings      = yaml.safeLoad(fs.readFileSync(_confPath, 'utf8'));
  const name          = settings.name
  const circle_token  = settings.secrets.circle_ci
  const github_token  = settings.secrets.github
  const octokit     = Octokit({
    auth: github_token,
    previews: ['luke-cage-preview', 'mercy-preview']
  })


  let owner = settings.org
  if (!owner) {
    ora.start('Finding current user')
    owner = (await octokit.users.getAuthenticated()).data.login
    ora.succeed()
  }

  ora.start(`Create the repo "${owner}/${name}"`)
  let repo = await octokit.repos.createInOrg({
    org: owner,
    name,
    description: settings.description,
    homepage: settings.homepage,
    private: settings.private,
    auto_init: true,
    has_issues: settings.feats.issues,
    has_projects: settings.feats.projects,
    has_wiki: settings.feats.wiki,
    allow_merge_commit: settings.pull_requests.merge,
    allow_rebase_merge: settings.pull_requests.rebase,
    allow_squash_merge: settings.pull_requests.squash
  })
  ora.succeed()



  if (settings.org) {
    let { org } = settings
    let teamsIDs = await __asyncIter(settings.teams, async function(team) {
      let [
        team_slug,
        permission = 'pull'
      ] = team.split(':')

      ora.start(`Find team: ${team_slug}`)
      let {
        data: { name, id }
      } = await octokit.teams.getByName({ org, team_slug })
      ora.succeed()

      return { team_name: name, team_id: id, permission }
    })

    await __asyncIter(teamsIDs, async function({ team_id, permission = 'pull', team_name }) {
      ora.start(`Give team ${team_name} "${permission}" authorization`)
      await octokit.teams.addOrUpdateRepo({
        team_id,
        owner: org,
        repo: name,
        permission
      })
      ora.succeed()
    })
  }



  if (settings.topics) {
    ora.start('Add topics to the repository')
    await octokit.repos.replaceTopics({
      owner,
      repo: name,
      names: settings.topics
    })
    ora.succeed()
  }


  if (settings.protected_branches) {
    __asyncIter(settings.protected_branches, async function({ branch, protections }) {
      let conf = merge(
        {
          required_status_checks: { strict: true, contexts: [] },
          enforce_admins: true,
          required_pull_request_reviews: { required_approving_review_count: 1 },
          restrictions: null
        },
        protections,
        { owner, repo: name, branch },

      )
      ora.start(`Apply protections for branch "${branch}"`)
      await octokit.repos.updateBranchProtection(conf)
      ora.succeed()
    })
  }




  if (settings.security.vulnerability_alerts) {
    ora.start('Enable vulnerability alerts')
    await octokit.repos.enableVulnerabilityAlerts({
      owner,
      repo: name
    })
    ora.succeed()
  }

  if (settings.integrations.CircleCI) {
    ora.start('Activate CircleCI')
    let url = `https://circleci.com/api/v1.1/project/github/${owner}/${name}/follow?circle-token=${circle_token}`
    await axios.post(url)
    ora.succeed()
  }
}

// async function rollback() {
//   ora.warn(`Deleting repo ${name}`)
//   await octokit.repos.delete({ owner: owner, repo: name })
// }

module.exports = async (conf)=> {
  try {
    await run(conf)
  } catch (e) {
    ora.isSpinning && ora.fail()
    e.message && ora.fail(`Error: ${e.message}`);
    (e.errors || [])
      .map((e)=> e.message)
      .forEach((m)=> ora.fail(`Error: ${m}`))
  }
  ora.stop()
}
