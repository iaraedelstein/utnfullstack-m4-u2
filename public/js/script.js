const tableContent = document.querySelector('#tableContent');

const getReviews = async() => {
    const response = await fetch('/api/review');
    console.log(response.url);
    const reviews = await response.json();
    reviews.forEach((review) => {
        const { username, value, description } = review;
        const { name: restaurant_name } = review.restaurant;
        const tr = document.createElement('tr');

        const userTd = document.createElement('td');
        const userTdContent = document.createTextNode(username);
        userTd.appendChild(userTdContent);

        const restTd = document.createElement('td');
        const restTdContent = document.createTextNode(restaurant_name);
        restTd.appendChild(restTdContent);

        const valueTd = document.createElement('td');
        const valueTdContent = document.createTextNode(value);
        valueTd.appendChild(valueTdContent);

        const descriptionTd = document.createElement('td');
        const descriptionTdContent = document.createTextNode(description);
        descriptionTd.appendChild(descriptionTdContent);

        tr.appendChild(userTd);
        tr.appendChild(restTd);
        tr.appendChild(valueTd);
        tr.appendChild(descriptionTd);

        tableContent.appendChild(tr);
    });
};

getReviews();