const BASE_URL="https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

//selecting all select tags in the dropdown class
const selects=document.querySelectorAll(".dropdown select");

//selecting the select tag in from class and in to class
const from=document.querySelector(".from select");
const to=document.querySelector(".to select");

const msg=document.querySelector(".msg");
const btn=document.querySelector("button");

//to change the flag whenever currency is changed in the dropdown menu
function updateFlag(evt)
{
    //finding the target element and going to parent of target element to find the image
    //The read-only parentElement property of Node interface returns the DOM node's parent Element, or null if the node either has no parent, or its parent isn't a DOM Element
    let element=evt.target;
    let image=element.parentElement.querySelector("img");

    //finding the currCode using the value attribute
    //as countryList is an object, we can find countryCode using the currCode
    let currCode=element.value;
    let countryCode=countryList[currCode];

    let flag=`https://flagsapi.com/${countryCode}/shiny/64.png`;
    image.src=flag;
}

for(let i=0;i<selects.length;i++)
{
    //adding event listeners to both select tags
    //The change event is fired for <input>, <select>, and <textarea> elements when the user modifies the element's value
    selects[i].addEventListener("change",updateFlag);

    //using the for in loop as countryList is an object
    for(let currCode in countryList)
    {
        //creating new element with tag name option
        let newOption=document.createElement("option");

        //Each <option> element should have a value attribute containing the data value to submit to the server when that option is selected
        //If no value attribute is included, the value defaults to the text contained inside the element
        //You can include a selected attribute on an <option> element to make it selected by default when page first loads
        newOption.innerText=currCode;
        newOption.value=currCode;

        if(selects[i].name==="from" && currCode==="USD")
        {
            newOption.selected=true;
        }

        if(selects[i].name==="to" && currCode==="INR")
        {
            newOption.selected=true;
        }

        //appending the new object to the select tag
        selects[i].append(newOption);
    }
}

//fucntion is declared async as the function uses await keyword
async function exchangeVal(evt)
{
    //very imp, as the buttons are not for submitting form data to a server, we are using preventDefault()
    //The preventDefault() method of the Event interface tells the user agent that if the event does not get explicitly handled, its default action should not be taken as it normally would be
    evt.preventDefault();
    
    let input=document.querySelector("input");
    let inputVal=input.value;
    
    if(inputVal==="" || inputVal<0)
    {
        input.value="1";
        inputVal=input.value;
    }

    //converting to lowercase as the api uses the text in lowercase format
    let fromCurr=from.value.toLowerCase();
    let toCurr=to.value.toLowerCase();
    
    //finding the URL for currency conversion
    let URL=`${BASE_URL}/${fromCurr}/${toCurr}.json`;

    //fetching the response from api and converting it into JavaScript object
    let response=await fetch(URL);
    let data=await response.json();
    
    //as data is an object, conversion rate can be found using toCurr
    let rate=data[toCurr];
    let finalVal=inputVal*rate;

    //using toFixed method to round off the number to 2 decimal digits
    finalVal=finalVal.toFixed(2);

    //printing the final conversion to the screen
    msg.innerText=`${inputVal} ${fromCurr.toUpperCase()} = ${finalVal} ${toCurr.toUpperCase()}`
}

//load event is added to windows to show conversion of USD to INR when the page is loaded
window.addEventListener("load",exchangeVal);
btn.addEventListener("click",exchangeVal);