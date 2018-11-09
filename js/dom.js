 //fetch the repos from github
 let fetchRepos = async () => {
     let response = await fetch('https://api.github.com/users/vtrev/repos');
     let repos = await response.json();
     return repos
 };

 //sort them out and take only the data needed
 let makeRepos = async (repos) => {
     let frontEndProjects = [];
     let backEndProjects = [];
     let herokuLinks = {
         "waiters-app": "https://vtrev-waiters.herokuapp.com/waiters/waiterNameHere",
         "shoe-store": "https://vtrev-shoesapi.herokuapp.com/",
         "settings-bill-expressjs": "https://vtrev-settings-bill.herokuapp.com/",
         "registrations-webapp": "https://vtrev-registrations.herokuapp.com/",
         "greetings-webapp": "https://vtrev-greetings.herokuapp.com/"
     }
     //seperate the repos into back and front-end
     repos.filter((repo) => {
         let description = repo.description;
         if (description) {
             let tmpRepo = {
                 'heading': repo.name,
                 'description': description.substr(0, description.length - 2)
             }
             let descriptor = description.slice(-2);
             if (descriptor == '**') {
                 let herokuKeys = Object.keys(herokuLinks);
                 herokuKeys.filter((repoName) => {
                     if (repoName == repo.name) {
                         tmpRepo.link = herokuLinks[repoName];
                         backEndProjects.push(tmpRepo);
                     }
                 });
             };
             if (descriptor == '.*') {
                 let tmpRepo = {
                     'heading': repo.name,
                     'description': description.substr(0, description.length - 1)
                 };
                 if (repo.default_branch == "gh-pages") {
                     tmpRepo.link = `https://vusibaloyi.xyz/${repo.name}`
                 }
                 frontEndProjects.push(tmpRepo)
             };
         };

     });
     return {
         frontEndProjects,
         backEndProjects
     }
 };
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


 fetchRepos()
     .then((response) => {
         return makeRepos(response);
     })
     .then(
         (data) => {
             let frontEndList = data.frontEndProjects.reverse();
             let backEndList = data.backEndProjects.reverse();
             populateProjects(frontEndList, 'frontEnd');
             populateProjects(backEndList, 'backEnd');
         }
     );