document.addEventListener('DOMContentLoaded', function () {

    // handlebars js to compile before carousel init

    let generateFooterSliderContent = function (techList) {
        let footerCarouselElement = document.getElementById("footer-carousel");
        let footerTechTemplateSource = document.getElementById("footer-tech-template").innerHTML;
        let footerTechTemplate = Handlebars.compile(footerTechTemplateSource);
        footerCarouselElement.innerHTML = footerTechTemplate(techList);
    };
    let techList = ["htmlcssjs", 'express', 'git', 'hb', 'heroku', "linux", 'nodejs', 'pg', 'rest', 'travis'];
    // let techList = ['heroku', 'css', 'express', 'git', 'travis', 'pg'];
    let populateProjects = (projects) => {
        let projectsData = {
            projects
        };
        let projectsElement = document.getElementById("projects");
        let projectsTemplateSource = document.getElementById("projects-template").innerHTML;
        let projectsTemplate = Handlebars.compile(projectsTemplateSource);
        let projectsHTML = projectsTemplate(projectsData);
        projectsElement.innerHTML = projectsHTML;
    }

    generateFooterSliderContent({
        techList
    });

    // materialize js

    //tooltips

    


    // footer carousel
    let footerCarousel = document.querySelector('#footer-carousel');
    var instances = M.Carousel.init(footerCarousel, {
        dist:-100,
        padding: 180,
        duration: 8000,
        numVisible: 3,
        onCycleTo:()=>{
            M.Carousel.getInstance(footerCarousel).next(4); 
        }


    });
    //  non materialize js
    

    //code that pulls repos from github
    let fetchRepos = async () => {
        let response = await fetch('https://api.github.com/users/vtrev/repos?per_page=100');
        let repos = await response.json();
        return repos;
    };
    //filter out unwanted data and repos
    let filterRepos = async (repos) => {
        let projects = [];
        let herokuLinks = {
            "waiters-app": "https://vtrev-waiters.herokuapp.com/waiters/waiterNameHere",
            "shoe-store": "https://vtrev-shoesapi.herokuapp.com/",
            "settings-bill-expressjs": "https://vtrev-settings-bill.herokuapp.com/",
            "registrations-webapp": "https://vtrev-registrations.herokuapp.com/",
            "greetings-webapp": "https://vtrev-greetings.herokuapp.com/",
            "stock-man":"https://vusi.world/stock-management/index.html"
        }

        repos.filter((repo) => {
            let description = repo.description;
            if (description) {
                let tmpRepo = {
                    'heading': repo.name,
                    'description': description.substr(0, description.length - 3),
                    'source': repo.html_url,
                    'hosted' :false
                    }
                let descriptor = description.slice(-3);
                console.log(repo.description,descriptor)
                if (descriptor == "***") {
                    
                    if (repo.name === "vtrev.github.io") {
                        tmpRepo.link = "https://vtrev.github.io";
                        projects.push(tmpRepo);
                        return;
                    }
                    //create links for the repos on gh-pages
                    if (repo.default_branch == "gh-pages") {
                        tmpRepo.link = `https://vtrev.github.io/${repo.name}`;
                        tmpRepo.hosted = true;
                        projects.push(tmpRepo);
                        
                    }
                    // create links for projects on Heroku
                    let herokuKeys = Object.keys(herokuLinks);
                    herokuKeys.filter((repoName) => {
                        if (repoName == repo.name) {
                            tmpRepo.link = herokuLinks[repoName];
                            tmpRepo.hosted = true;
                            projects.push(tmpRepo);
                        }
                    });
                }
                if (descriptor === "*_*") {
                    projects.push(tmpRepo);
                }
            };
        });
        return {
            projects
        }
    };

    
    fetchRepos()
        .then((response) => {  
            return filterRepos(response);
        })
        .then(
            (data) => {
                let projectList = data.projects.reverse();
                populateProjects(projectList);
                //initialize tooltips js after html has been injected
                var tooltipElems = document.querySelectorAll('.tooltipped');
                var instances = M.Tooltip.init(tooltipElems,{
                    margin:15,
                    outDuration:0,
                    transitionMovement:0
            } );
            }
        );
});
