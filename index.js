import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
    databaseURL: "https://shopping-list-test-project-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")


const publishBtn = document.getElementById('publish-btn')
const textArea = document.getElementById('text-area')
const fromIn = document.getElementById('from-input')
const toIn = document.getElementById('to-input')
const ulEl = document.getElementById('list-a')

publishBtn.addEventListener('click', function () {
    let textAreaValue = textArea.value
    let fromInputValue = fromIn.value
    let toInputValue = toIn.value
    let arrayvalues = {
        firstValue: textAreaValue, 
        secondValue: fromInputValue, 
        thirdValue: toInputValue,
        fourthValue: 0}
    push(shoppingListInDB, arrayvalues)
    clearIputValues ()
})


function clearIputValues (){
    textArea.value = ''
    fromIn.value = ''
    toIn.value = ''
}

function displayData (currentItem) {

    let currentID = currentItem[0]
    let currentValue = currentItem[1]
    let textAreaValue = currentValue.firstValue
    let fromInputValue = currentValue.secondValue
    let toInputValue = currentValue.thirdValue
    let likesValue = currentValue.fourthValue

    let liEl = document.createElement('li')
    let mainDiv = document.createElement('div')
    mainDiv.classList.add('notification-conteiner')
    let topDiv = document.createElement('div')
    topDiv.classList.add('like-conteiner')
    topDiv.innerHTML = `<h3>From: ${fromInputValue}</h3>`
    let removeBtn = document.createElement('button')
    removeBtn.classList.add('remove-button')
    removeBtn.textContent = 'x'
    let mainParagraph = document.createElement('p')
    mainParagraph.innerHTML = textAreaValue
    let bottomDiv = document.createElement('div')
    bottomDiv.classList.add('like-conteiner')
    bottomDiv.innerHTML = `<h3>To: ${toInputValue}</h3>`
    let likeBtn = document.createElement('button')
    likeBtn.classList.add('like-button')
    likeBtn.textContent = `❤️${likesValue}`




    
    removeBtn.addEventListener('dblclick', function () {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${currentID}`)
        remove(exactLocationOfItemInDB)
    })

    likeBtn.addEventListener('click', function () {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${currentID}`);

        set(exactLocationOfItemInDB, {
            firstValue: textAreaValue,
            secondValue: fromInputValue,
            thirdValue: toInputValue,
            fourthValue: likesValue + 1
        })
    })


    ulEl.appendChild(liEl)
    liEl.appendChild(mainDiv)
    mainDiv.appendChild(topDiv)
    topDiv.appendChild(removeBtn)
    mainDiv.appendChild(mainParagraph)
    mainDiv.appendChild(bottomDiv)
    bottomDiv.appendChild(likeBtn)
}
onValue(shoppingListInDB, function(snapshot){
    if (snapshot.exists()) {
        ulEl.innerHTML = ''
        let data  = Object.entries(snapshot.val())
        for (let i = 0; i < data.length; i++) {
            let currentItem = data[i]
            displayData(currentItem)
        }
    } else {
        ulEl.innerHTML= `<h1>There is no posts to show ...</h1>`
    }
})