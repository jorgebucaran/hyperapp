import { app, html } from "flea"
import "whatwg-fetch"

const URL = "https://api.github.com/orgs/fisherman/repos?per_page=100"

const model = {
    search: "",
    repos: [],
    isFetching: false,
    org: "github"
}

const view = (model, msg) => html`
    <div>
        <input
            placeholder="Filter search"
            oninput=${e => msg.search(e.target.value)} type="text" />

        <p>${model.isFetching ? "Fetching repositories..." : ""}</p>

        <ul>
            ${model.repos
                .filter(({ name }) => name.substr(0, model.search.length) === model.search)
                .map(({ name, description, url, stars }) => html`
                    <li>
                        <a title=${description} href=${url}>${name}</a>
                        <span> ${stars} ★</span>
                    </li>`)}
        </ul>
    </div>`

const update = {
    search: (model, value) => ({ ...model, search: value }),
    update: (model, { repos, isFetching }) => ({
        ...model, repos: repos || [], isFetching })
}

const subs = [
    msg => {
        msg.update({ isFetching: true })

        fetch(`https://api.github.com/orgs/${model.org}/repos?per_page=100`)
            .then(repos => repos.json())
            .then(repos => repos.map(repo => ({
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
                stars: repo.stargazers_count
            })))
            .then(repos => msg.update({ repos, isFetching: false }))
    }
]

app({ model, view, update, subs })


