// For the feature of infinite scroll
let tweetOffset = 0;
let runningCriticalFunction = false;

// Selectors 

const container = document.querySelector('.tweet-body');
const tweetBtn = document.querySelector('.tweetBox_tweetButton');
const inputBox = document.querySelector('.tweetbox_input input');

window.onload = async () => {

    if(runningCriticalFunction) return ;
    runningCriticalFunction = true ;
    const result = await fetch(`https://twitter-backend-6yot.onrender.com/tweet/recent?offset=${tweetOffset}`);
    // Paginated API

    const tweets = await result.json();

    /*
      _id: "63ab03741d21f5732d85d41b", title: "Tweet 6", text: "Random Value", … }
  ​
        __v: 0
        ​
        _id: "63ab03741d21f5732d85d41b"
        ​
        creationDatetime: "Tue Dec 27 2022 14:38:44 GMT+0000 (Coordinated Universal Time)"
        ​
        text: "Random Value"
        ​
        title: "Tweet 6"
        ​
        userId: "12345"
    */

    let storeData = tweets.data;
    tweetOffset = tweetOffset + storeData.length;

    console.log(storeData);

    for (let i = 0; i < storeData.length; i++) {
        let element = document.createElement('div');
        element.setAttribute('class', 'post');
        element.setAttribute('id', `${storeData[i]._id}`);
        const date = new Date(storeData[i].creationDatetime);
        element.innerHTML = `

        <div class="post_avatar">
                <img src="https://www.w3schools.com/howto/img_avatar.png" alt="" srcset="">
            </div>
            
            <div class="post_body">
                
                <div class="post_header">
                    <div class="post_headerText">
                        <h3>Abhirup Dey
                            <span class="post_headerSpecial hello">
                                <span class="material-symbols-outlined badge search">
                                    verified
                                </span> <span class="userName">${date.toDateString()}</span> 
                            </span>
                        </h3>
                    </div>
                    <div class="post_header_description">
                        <p id='p-${storeData[i]._id}'> ${storeData[i].title} </p>
                    </div>
                </div>
                
                <img src="https://cdn.vox-cdn.com/thumbor/hmpaCUVdDwLr1-I9b1E62IX9kTM=/0x0:1800x2700/1400x1050/filters:focal(856x1604:857x1605)/cdn.vox-cdn.com/uploads/chorus_asset/file/24286088/226444_Mercedes_Avatar_DGolson_0011.jpg"
                alt="">
                
                <div class="post_footer">
    <span data-id='${storeData[i]._id}' id='span-${storeData[i]._id}'  class="material-symbols-outlined edit">
                        edit
                    </span>
                    <span data-id=${storeData[i]._id} class="material-symbols-outlined heart">
                        favorite
                    </span>
                    <span data-id=${storeData[i]._id} class="material-symbols-outlined delete">
                      delete
                    </span>
                </div>
            </div>
        
        `;
        container.append(element);
        runningCriticalFunction = false ;
    }

}

// Function for for rendering the new tweet in the UI

tweetBtn.addEventListener('click', async (e) => {

    e.preventDefault();

    const tweetText = inputBox.value;

    // Here, the backend will ask to send the data in the body format in the following format with the names of the variables as said by the backend engineer

    const data = {
        title: tweetText,
        text: "Random Value",
        userId: "12345"
    }

    // API for the tweet Creation which is been sent by the backend
    const tweetResponse = await fetch('https://twitter-backend-6yot.onrender.com/tweet/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    const tweet = await tweetResponse.json();

    if (tweet.status !== 200) {
        alert(tweet.message);
        return;
    }

    // appending the element in the UI

    /*
    data: Object { tweetId: "63b1da24bc6b76d435152b25", text: "Random Value", creationDatetime: "Sun Jan 01 2023 19:08:20 GMT+0000 (Coordinated Universal Time)", … }
 ​
creationDatetime: "Sun Jan 01 2023 19:08:20 GMT+0000 (Coordinated Universal Time)"
 ​
text: "Random Value"
 ​
tweetId: "63b1da24bc6b76d435152b25"
 ​
userId: "12345"
 ​
<prototype>: Object { … }
​
message: "Tweet Created successfully"
​
status: 200
    */

    let element = document.createElement('div');
    element.setAttribute('class', 'post');
    element.setAttribute('id', `${tweet._id}`);
    const date = new Date(tweet.data.creationDatetime);
    element.innerHTML = `

    <div class="post_avatar">
        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="" srcset="">
    </div>
    
    <div class="post_body">
        
        <div class="post_header">
            <div class="post_headerText">
                <h3>Abhirup Dey
                    <span class="post_headerSpecial hello">
                        <span class="material-symbols-outlined badge search">
                            verified
                        </span> <span class="userName">${date.toDateString()}</span> 
                    </span>
                </h3>
            </div>
            <div class="post_header_description">
                <p id='p-${tweet._id}'> ${tweetText} </p>
            </div>
        </div>
        
        <img src="https://cdn.vox-cdn.com/thumbor/hmpaCUVdDwLr1-I9b1E62IX9kTM=/0x0:1800x2700/1400x1050/filters:focal(856x1604:857x1605)/cdn.vox-cdn.com/uploads/chorus_asset/file/24286088/226444_Mercedes_Avatar_DGolson_0011.jpg"
        alt="">
        
        <div class="post_footer">
    <span data-id='${tweet._id}' id='span-${tweet._id}' class="material-symbols-outlined edit">
                edit
            </span>
            <span data-id=${tweet._id} class="material-symbols-outlined heart">
                favorite
            </span>
            <span data-id=${tweet._id} class="material-symbols-outlined delete">
                      delete
            </span>
        </div>
    </div>

`;
    container.append(element);

    inputBox.value = "";
    alert(tweet.message);

})

// Function for deleting the tweet from the UI

document.addEventListener('click' , async (e) => {

    if(e.target.classList.contains('delete')) {
        
        if(confirm("Are you sure, you want to delete this tweet?"))
        {
            const tweetId = e.target.getAttribute('data-id') ;

            const data = {
                tweetId , 
                userId: "12345"
            };

            const response = await fetch('https://twitter-backend-6yot.onrender.com/tweet/delete' , {
                method: 'POST' ,
                headers : {
                    'Content-Type' : 'application/json' ,
                } ,
                body : JSON.stringify(data) 
            })

            const result = await response.json() ;
            console.log(result) ;

            if(result.status !== 200 ) {
                alert(result.message) ;
                return ;
            }

            document.getElementById(tweetId).remove() ;

        }

    }

    if(e.target.classList.contains('edit')) {
        const tweetId = e.target.getAttribute('data-id') ;

        const pTag = document.getElementById('p-' + tweetId)
        const span = document.getElementById('span-' + tweetId) ;

        const tweetText = prompt("Enter the new tweet Text" , pTag.innerText) ;

        const data = {
            tweetId ,
            title : tweetText , 
            text : "King" ,
            userId : "12345"
        }

        const response = await fetch('https://twitter-backend-6yot.onrender.com/tweet/update' , {
            method : 'POST' ,
            headers : {
                'Content-Type': 'application/json',
            } ,
            body :JSON.stringify(data)
        })

        const result = await response.json() ;

        if(result.status !== 200) {
            alert(result.message);
            return;
        }

        alert("Sucessfully updated the tweet") ;
        pTag.innerText = tweetText ;

    }

})

// For the infinite scroll 

window.addEventListener('scroll', () => {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } =  document.documentElement;

    // console.log(scrollTop, scrollHeight, clientHeight);

    if((scrollTop + clientHeight) >= (scrollHeight - 20)) {
        getTweetsAndInsertHTML();
    }
})

