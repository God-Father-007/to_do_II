let TC = document.querySelector(".ticket-container");

showTickets("all");

function showTickets(filterColor) {
    let allTaskData = localStorage.getItem("allTasks");
    if( allTaskData != null ) {
        let data = JSON.parse(allTaskData);
        for( let ticket of data ) {
            if( filterColor == "all" || filterColor == ticket.priority ) {
                addTicket(true,null,ticket.task,ticket.ticketID,ticket.priority);
            }
        }
    }
}


let allFilters = document.querySelectorAll(".filter");
for( let filter of allFilters ) {
    filter.addEventListener("click",filterHandler);
}

let filterCount = 0;

function filterHandler(e) {
    let filterBy = e.currentTarget.children[0].classList[0].split("-")[0]
    if( e.currentTarget.classList.contains("active") ) {
        e.currentTarget.classList.remove("active");
        let allVisibleTickets = document.querySelectorAll(".ticket");
        for( let visibleTicket of allVisibleTickets ) {
            if( visibleTicket.children[0].classList[1].split("-")[0] == filterBy ) { visibleTicket.remove(); }
        }
        filterCount--;
    } else {
        e.currentTarget.classList.add("active");
        if( filterCount == 0 ) { TC.innerHTML = ""; }
        filterCount++;
        showTickets(filterBy);
    }

    if( filterCount == 0 ) {
        showTickets("all");
    }
}

let addButton = document.querySelector(".add");
addButton.addEventListener("click",showModal);
let modalVisible = false;
let colorSelected = "cyan";

function showModal(e) {
    if( !modalVisible ) {
        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `<div class="task-to-be-added" spellcheck="false" data-type="false" contenteditable="true" >
                            <span class="placeholder" >Enter Your Text Here</span>
                        </div>
                        <div class="priority-list" >
                            <div class="cyan-modal-filter modal-filter active" ></div>
                            <div class="yellow-modal-filter modal-filter" ></div>
                            <div class="magenta-modal-filter modal-filter" ></div>
                            <div class="black-modal-filter modal-filter" ></div>
                        </div>`;
        TC.appendChild(modal);
        modalVisible = true;
        let taskTyper = document.querySelector(".task-to-be-added");
        taskTyper.addEventListener("click",function(e){
            if( e.currentTarget.getAttribute("data-type") == "false" ) {
                e.currentTarget.innerHTML = "";
                e.currentTarget.setAttribute("data-type","true");
            }
        })
        taskTyper.addEventListener("keypress",addTicket.bind(this,false,taskTyper,"",uuidv4(),""))
        
        let modalFilters = document.querySelectorAll(".modal-filter");
        for( let filter of modalFilters ) {
            filter.addEventListener("click",selectPriority);
        }

    }
}

function selectPriority(e) {
    let active = document.querySelector(".modal-filter.active");
    active.classList.remove("active");
    colorSelected = e.currentTarget.classList[0].split("-")[0];
    e.currentTarget.classList.add("active");
}

function uuidv4() {
    return ([1e3]+-1e3).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function addTicket(firstLoad,taskTyper,hasTask,id,hasPriority,e) {
    let task = "";
    let color = "";
    if( hasTask == "" ) { task = taskTyper.innerText; } else { task = hasTask; }
    if( hasPriority == "" ) { color = colorSelected; } else { color = hasPriority; }
    if( firstLoad || (e.key == "Enter" && e.shiftKey == false && task.trim() != "") ) {
        let ticket = document.createElement("div");
        ticket.classList.add("ticket");
        ticket.innerHTML = `<div class="ticket-color ${color}-ticket-color" ></div>
                        <div class="ticket-id" >${id}</div>
                        <div class="task" >${task}</div>`;
        
        ticket.addEventListener("click",function(e){
            if( e.currentTarget.classList.contains("active") ) {
                e.currentTarget.classList.remove("active");
            } else {
                e.currentTarget.classList.add("active");
            }
        })
        ticket.addEventListener("dblclick", updateTicket.bind(this, ticket.children[0].classList[1].split("-")[0], ticket.children[1].innerText, ticket.children[2].innerText ));

        TC.appendChild(ticket);

        if( !firstLoad ) {
            document.querySelector(".modal").remove();
            modalVisible = false;
            colorSelected = "cyan";

            let allTaskData = localStorage.getItem("allTasks");
            let data = [];
            let currentTicket = { "ticketID" : id, "task" : task, "priority" : color }
            if( allTaskData != null ) { data = JSON.parse(allTaskData); }
            data.push( currentTicket );
            localStorage.setItem("allTasks",JSON.stringify(data));
        }

    } else if( e.key == "Enter" && e.shiftKey == false ) {
        e.preventDefault();
        alert("Yout didn't type anything");
    }
}

let deleteButton = document.querySelector(".delete");

deleteButton.addEventListener("click",function(e){
    let selectedTickets = document.querySelectorAll(".ticket.active");
    for( let ticket of selectedTickets ) {
        let IdToDelete = ticket.children[1].innerText;
        let allTaskData = localStorage.getItem("allTasks");
        if( allTaskData != null ) {
            let data = JSON.parse(allTaskData);
            for( let i in data ) {
                if( data[i].ticketID == IdToDelete ) {
                    data.splice(i,1);
                    localStorage.setItem( "allTasks", JSON.stringify(data) );
                    break;
                }
            }
        }
        ticket.remove();
    }
});

// update a ticket

function updateTicket ( color, id, task, e ){
    if( !modalVisible ) {
        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `<div class="task-to-be-added" spellcheck="false" data-type="false" contenteditable="true" >
                            <span class="placeholder" >Enter Your Text Here</span>
                        </div>
                        <div class="priority-list" >
                            <div class="cyan-modal-filter modal-filter active" ></div>
                            <div class="yellow-modal-filter modal-filter" ></div>
                            <div class="magenta-modal-filter modal-filter" ></div>
                            <div class="black-modal-filter modal-filter" ></div>
                        </div>`;
        TC.appendChild(modal);
        modalVisible = true;
        let taskTyper = document.querySelector(".task-to-be-added");
        taskTyper.addEventListener("click",function(e){
            if( e.currentTarget.getAttribute("data-type") == "false" ) {
                e.currentTarget.setAttribute("data-type","true");
            }
        })
        taskTyper.innerText = task;
        taskTyper.addEventListener("keypress",updateTicketData.bind(this,taskTyper,id,))
       
        document.querySelector(".cyan-modal-filter").classList.remove("active");
        document.querySelector("." + color + "-modal-filter").classList.add("active");
        let modalFilters = document.querySelectorAll(".modal-filter");
        for( let filter of modalFilters ) {
            filter.addEventListener("click",selectPriority);
        }

    }
}

function updateTicketData(taskTyper,id,e) {
    if( e.key == "Enter" && e.shiftKey == false && taskTyper.innerText.trim() != "" ) {
        
        let allTaskData = localStorage.getItem("allTasks");
        if( allTaskData != null ) {
            let data = JSON.parse(allTaskData);
            for( let i in data ) {
                if( data[i].ticketID == id ) {
                    data[i].task = taskTyper.innerText;
                    data[i].priority = colorSelected;
                    localStorage.setItem("allTasks", JSON.stringify(data));
                    break;
                }
            }
        }

        document.querySelector(".modal").remove();
        TC.innerHTML = "";
        showTickets("all");
        modalVisible = false;
        colorSelected = "cyan";

    } else if( e.key == "Enter" && e.shiftKey == false ) {
        e.preventDefault();
        alert("Yout didn't type anything");
    }
    
}