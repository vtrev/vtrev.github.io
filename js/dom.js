document.addEventListener('DOMContentLoaded', function () {

    // handlebars to compile before carousel init

    let generateFooterSliderContent = function (techList) {
        let footerCarouselElement = document.getElementById("footer-carousel");
        let footerTechTemplateSource = document.getElementById("footer-tech-template").innerHTML;
        let footerTechTemplate = Handlebars.compile(footerTechTemplateSource);
        footerCarouselElement.innerHTML = footerTechTemplate(techList);
    };
    let techList = ['css', 'express', 'git', 'hb', 'heroku', 'html', 'js', 'mocha', 'mysql', 'nodejs', 'pg', 'rest', 'travis'];
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

    fetchRepos()
        .then((response) => {
            return makeRepos(response);
        })
        .then(
            (data) => {
                let projectList = data.backEndProjects.reverse();
                populateProjects(projectList);
                //initialize collapsible at the end
                let elems = document.querySelectorAll('.collapsible');
                let instances = M.Collapsible.init(elems, {});

            }
        );

});