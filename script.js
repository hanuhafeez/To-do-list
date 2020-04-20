const listCont = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayCont = document.querySelector('[data-list-display-container]')
const listTileElt = document.querySelector('[data-list-title]')
const listCountElt = document.querySelector('[data-list-count]')
const tasksCont = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTaskButton = document.querySelector('[data-clear-complete-task-button]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)
// let lists = []

listCont.addEventListener('click', e => {
  if(e.target.tagName.toLowerCase() === 'li'){
     selectedListId = e.target.dataset.listId
     saveAndRender()
    }
})

tasksCont.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'input'){
       const selectedList = lists.find(list => list.id === selectedListId)
       const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
       selectedTask.complete = e.target.checked
       save()
       renderTaskCount(selectedList)
      }
  })

deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})

clearCompleteTaskButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})


 newListForm.addEventListener('submit', e => {
  e.preventDefault()
  const listName = newListInput.value
  if(listName == null || listName === '') return
  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if(taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
  })

function createList(name){
    return {id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name){
    return {id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender()
{
    save()
    render()
}
function save()
{
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render(){
    clearElement(listCont)
    renderLists()

    const selectedList = lists.find(list => list.id == selectedListId)
    if(selectedListId == null){
       listDisplayCont.style.display = 'none'
    }
    else{
        listDisplayCont.style.display = ''
        listTileElt.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(tasksCont)
        renderTasks(selectedList)
    }
    
}

function renderTasks(selectedList){
    selectedList.tasks.forEach(task => {
        const taskElt = document.importNode(taskTemplate.content, true)
        const checkbox = taskElt.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElt.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksCont.appendChild(taskElt)
    })
}

function renderTaskCount(selectedList){
    const incompTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompTaskCount === 1 ? "task" : "tasks"
    listCountElt.innerText = `${incompTaskCount} ${taskString} remaining`
}

function renderLists(){
    lists.forEach(list => {
        const listElt = document.createElement('li')
        listElt.classList.add('list-name')
        listElt.dataset.listId = list.id
        listElt.innerText = list.name
        if(list.id === selectedListId)
        {
            listElt.classList.add('active-list')
        }
        listCont.appendChild(listElt) 
    })
}

function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }    
}

render()
