import { app, html } from "flea"
import "whatwg-fetch"

const URL = "https://api.github.com/orgs/fisherman/repos?per_page=100"

const model = {
    search: "",
    repos: [],
    isFetching: false
}

const view = (model, msg) => html`
    <div>
        <input oninput=${e => msg.search(e.target.value)} type="text" />
        ${model.repos
            .filter(({ name }) => name.substr(0, model.search.length) === model.search)
            .map(({ name, description, url, stars }) => html`
            <div>
                <div>
                    <a href=${url}>${name}</a><span> ${stars} stars</span>
                </div>
                <p>${description}</p>
            </div>

        `)}
    </div>`

const update = {
    search: (model, value) => ({ ...model, search: value }),
    update: (model, { repos, isFetching }) => ({ ...model, repos, isFetching })
}

const subs = [
    msg =>
        fetch(URL)
        .then(repos => repos.json())
        .then(repos => repos.map(repo => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count
        })))
        .then(repos => msg.update({ repos, isFetching: false }))
]

app(model, view, update, subs)


