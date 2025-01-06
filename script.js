const appContainer = document.querySelector('.app-container');
const formContainer = document.querySelector('.searching-container');
const inputElement = formContainer.querySelector('.searching-container__input');
const responseContainer = document.querySelector('.response-container');
const repositoriesContainer = document.querySelector('.repositories-container');
let repositories = [];

function createListElement (repository) {
    const listElement = document.createElement('li');
    listElement.classList.add('response-container__item');
    listElement.textContent = repository.name;
    listElement.setAttribute('id', `${repository.id}`)
    responseContainer.append(listElement);
    return responseContainer;
}

function createRepositoryCard (repository) {
    const {owner} = repository;

    const repositoryCard = document.createElement('div');
    repositoryCard.classList.add('repositories-container__item');
    repositoryCard.setAttribute('id', `${repository.id}`);

    const buttonElement = document.createElement('button');
    buttonElement.classList.add('repositories-container__button');
    buttonElement.setAttribute('id', `${repository.id}`);

    const infoContainer = document.createElement('p');
    infoContainer.classList.add('repositories-container__wrapper');

    const nameElement = document.createElement('span');
    nameElement.textContent = `Name: ${repository.name}`;

    const ownerElement = document.createElement('span');
    ownerElement.textContent = `Owner: ${owner.login}`;

    const starsElement = document.createElement('span');
    starsElement.textContent = `Stars: ${repository.stargazers_count}`;

    infoContainer.append(nameElement, ownerElement, starsElement);
    repositoryCard.append(infoContainer, buttonElement);
    repositoriesContainer.append(repositoryCard);
    return infoContainer;
}

function selectMenuItem (evt) {
    const target = evt.target;
    const targetRepository = repositories.find((repository) => repository.id === Number(target.id));
    createRepositoryCard(targetRepository);
    inputElement.value = null;
    responseContainer.textContent = null;
}

function removeRepositoryCard (evt) {
    const target = evt.target;
    if (target.tagName !== 'BUTTON') {
        return;
    }
    target.parentNode.remove();
}

function clearResponseContainer () {
    responseContainer.innerHTML = null;
    if (responseContainer.children.length !== 0) {
        responseContainer.textContent = null;
        getRepositories();
    } 
}

function debouncingInputElement (fn, debounceTime) {
    let timeout;
    return function () {
        const event = () => {fn.apply(this, arguments)};
        clearTimeout(timeout);
        timeout = setTimeout(event, debounceTime);
    }
}

async function getRepositories () {
    if (!inputElement.value.trim()) {
        return;
    }
    const queryValue = `q=${inputElement.value.trim()}&per_page=5&order=desc`;
    const response = await fetch(`https://api.github.com/search/repositories?${queryValue}`);
    const reposObj = await response.json();
    repositories = reposObj.items;
    repositories.forEach((repository) => {
        createListElement(repository);
    });
}

const debouncedInputHandler = debouncingInputElement(getRepositories, 800);

inputElement.addEventListener('input', debouncedInputHandler);
inputElement.addEventListener('input', clearResponseContainer);
repositoriesContainer.addEventListener('click', removeRepositoryCard);
responseContainer.addEventListener('click', selectMenuItem);