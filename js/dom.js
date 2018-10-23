let fetchRepos = async () => {
    let frontEndProjects = [];
    let backEndProjects = [];

    let response = await fetch('https://api.github.com/users/vtrev/repos');
    let repos = await response.json();
    repos.filter((repo) => {
        let description = repo.description;
        if (description) {
            let descriptor = description.slice(-2);
            console.log(descriptor);
            if (descriptor == '**') {
                backEndProjects.push({
                    'heading': repo.name,
                    'description': description.substr(0, description.length - 2)
                })
            }
            if (descriptor == '.*') {
                frontEndProjects.push({
                    'heading': repo.name,
                    'description': description.substr(0, description.length - 1)

                })
            }
        }

    });

    return {
        frontEndProjects,
        backEndProjects
    }
};


fetchRepos().then(
    (data) => {
        console.log('Done fetching repos..')
        let frontEndList = data.frontEndProjects;
        let backEndList = data.backEndProjects;
        populateProjects(frontEndList, 'frontEnd');
        populateProjects(backEndList, 'backEnd');
    }
)


let populateProjects = (projects, type) => {

    let projectsData = {
        projects
    };

    let frontEndElement = document.getElementById("front-end");
    let backEndElement = document.getElementById("back-end")
    let projectsTemplateSource = document.getElementById("projects-template").innerHTML;
    let projectsTemplate = Handlebars.compile(projectsTemplateSource);
    let projectsHTML = projectsTemplate(projectsData);
    if (type == 'frontEnd') {
        frontEndElement.innerHTML = projectsHTML;
    }
    if (type == 'backEnd') {
        backEndElement.innerHTML = projectsHTML;
    }
}