document.addEventListener('DOMContentLoaded', function () {

    // handlebars to compile before carousel init

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

    // materialize css

    // footer carousel
    var elems = document.querySelector('#footer-carousel');
    var instances = M.Carousel.init(elems, {
        dist: 0,
        padding: 50,
        duration: 1500,
        numVisible: 3
    });

    var slideFooterCarousel = () => {
        let carousel = document.getElementById('footer-carousel');
        instance = M.Carousel.getInstance(carousel);
        instance.next();
        setTimeout(slideFooterCarousel, 2000);
    }
    slideFooterCarousel();

    // =========================================== non materialize js ===================================================== //
    //fetch the repos from github
    let fetchRepos = async () => {
        let response = await fetch('https://api.github.com/users/vtrev/repos?per_page=100');
        let repos = await response.json();
        return repos
    };

    //sort them out and take only the data needed
    let makeRepos = async (repos) => {
        let projects = [];
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
                    'description': description.substr(0, description.length - 3),
                    'source': repo.html_url
                }
                let descriptor = description.slice(-3);
                if (descriptor == '***') {
                    if (repo.name === "vtrev.github.io") {
                        tmpRepo.link = "https://vusibaloyi.xyz";
                        projects.push(tmpRepo);
                        return;
                    }
                    if (repo.default_branch == "gh-pages") {
                        tmpRepo.link = `https://vusibaloyi.xyz/${repo.name}`;
                        projects.push(tmpRepo);
                    }
                    let herokuKeys = Object.keys(herokuLinks);
                    herokuKeys.filter((repoName) => {
                        if (repoName == repo.name) {
                            tmpRepo.link = herokuLinks[repoName];
                            projects.push(tmpRepo);
                        }
                    });
                }
                if (descriptor === "*_*") {
                    tmpRepo.link = "#";
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
            return makeRepos(response);
        })
        .then(
            (data) => {
                let projectList = data.projects.reverse();
                populateProjects(projectList);
                //initialize collapsible at the end
                let elems = document.querySelectorAll('.collapsible');
                let instances = M.Collapsible.init(elems, {});

            }
        );

});