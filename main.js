
async function listBlogPosts() {

    let url = "/";

    //cant seem to fetch and list blogpost when moved to index file.
    //Can try to seperate the javascript and index.html files.

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (response.status != 200) {
            throw data.error;

        }

        console.log('test');
        container.innerHTML = ""; //delete previous content

        for (let value of data) {

            let date = new Date(value.date);

            let html = "<h2>" + value.heading + "</h2>";
            html += "<p>" + date.toLocaleDateString() + "</p>";
            html += "<p>" + value.blogtext + "</p><hr>";

            let div = document.createElement("div");
            div.innerHTML = html;
            container.appendChild(div);

            let delbtn = document.createElement("button");
            delbtn.innerHTML = "Delete";

            delbtn.addEventListener('click', function (evt) {
                deleteBlogPost(value.id);
            });

            div.insertBefore(delbtn, div.lastElementChild);
        }
    }
    catch (error) {
        console.log(error);
    }

listBlogPosts();


};