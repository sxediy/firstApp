const simpleApp = (() => { // обёртка всего кода (паттерн "Фасад" )

function createElement(tag, props, ...children) {  // функция создания новых элементов наподобие ф-ции в React
	const element = document.createElement(tag);

	Object.keys(props).forEach(key => element[key] = props[key]);

	if(children.length > 0) {
		children.forEach(child => {
			if (typeof child === 'string') {
				child = document.createTextNode(child);
			}
			element.appendChild(child);
		});
	}
return element
	
}


function createSuffix(userAge,indexUser) {  // учитывается склонение слова "год" согласно правилам русского языка (1 год, 4 года, 5 лет и т.д.)
     var suffix ;
    if (userAge >=5 &&  userAge<=20)  suffix = 'лет';   
	else if ((userAge>=2 && userAge<=4) || (userAge % 10 === 2 || userAge % 10 === 3 || userAge % 10 === 4) )  suffix = 'года';
	else if (userAge === 1 || userAge % 10 === 1 ) suffix = 'год';
	else suffix = 'лет'; 
	array[indexUser].suffix = suffix; // запись "суффикса" в массив данных
	 
	console.log('суффик - '+suffix);
   
   };


function createItem(title1, title2, title3) {    // передача данных пользователя ф-ции , создающей элементы в DOM
	
	const checkbox = createElement('input', {type:'checkbox', className:'checkbox', id:'stylecheckbox'});

	const label1 = createElement('label', {className:'title1'}, title1 );
	const label2 = createElement('label', {className:'title2'}, title2 + " " + title3 );

	const editInput1 = createElement('input', {type:'text', className:'textfield1'} );
	const editInput2 = createElement('input', {type:'number', className:'textfield2'} );

    const editButton1 = createElement('button', {className:'edit'}, 'Изменить Имя');
	const editButton2 = createElement('button', {className:'edit'}, 'Изменить Возраст');
	const deleteButton = createElement('button', {className:'delete'}, 'Удалить');
	
	const listItem = createElement('li', {className:'user-item'}, checkbox, label1, label2, editInput1, editInput2, editButton1, editButton2, deleteButton );
   
   bindEvents(listItem); // подписка на события
    return listItem;
   
}

function bindEvents(item) {                                // подписка на события
	const checkbox = item.querySelector('.checkbox');
	const editButton1 = item.querySelector('.edit');
	const editButton2 = item.querySelectorAll('.edit')[1];
	const deleteButton = item.querySelector('.delete');

	checkbox.addEventListener('change', toggleItem);
	editButton1.addEventListener('click', editItem1);
	editButton2.addEventListener('click', editItem2);
	deleteButton.addEventListener('click', deleteItem);
}


function addItem(event,indexUser) {    // добавления данных нового пользователя
    const  userName = document.forms.users.elements.name.value;
    const  userAge =  document.forms.users.elements.age.value;

	
	const item = createItem(userName, userAge, array[indexUser].suffix);
	userList.appendChild(item) ;
	if(array.length>=2) {
		sortButtons.classList.remove('hideSortButtons');
	    buttonForNames.disabled = false;	  	    	
	    buttonForAges.disabled = false;
	} else {null;}; 

	 console.log( array );                              
};



  function toggleItem(){                       // изменяет стиль при выборе/снятии чекбокса вешанием/снятием класса в CSS
  	const listItem = this.parentNode;
   	                      
  	listItem.classList.toggle('completed');
  	const isCompleted = listItem.parentNode.querySelector('.completed'); 
  	const deleteButtons = listItem.parentNode.querySelectorAll('.delete'); //все кнопки 'удалить'
   	
     	
    if(isCompleted) {  // если хотя бы один флажок активен
   	   
   	  	   [].forEach.call(deleteButtons, button => button.disabled = true);  // /все кнопки 'удалить' отключаются
   	     
 	  	   switchDeleteCheckedAndUncheckAll(false); // кнопки 'удалить отмеченные' и 'снять все галочки' появляются и становятся активными
 	  	   switchSortButtons(true);        // кнопки сортировки отключаются  и становятся невидимыми
   	  	    
   	  	} else {   // когда нет ни одного флажка
        
   	      [].forEach.call(deleteButtons, button => button.disabled = false); // /все кнопки 'удалить' включются
   	  	   
   	  	    switchSortButtons();             // кнопки сортировки вкключаются  и становятся видимыми
   	        switchDeleteCheckedAndUncheckAll(true); 	// кнопки 'удалить отмеченные' и 'снять все галочки' исчезают и выключаются 	    
   	  	};    		
  };



function editItem1(event) {    // редактирование имени пользователя                           
	const listItem = this.parentNode;                          // 'li'
	const title1 = listItem.querySelector('.title1');            // элемент label
	const editInput1 = listItem.querySelector('.textfield1');    // поле ввода
	
	const isEditing1 = listItem.classList.contains('editing1');  // режим редактирования согласно регулярному выражению

	if(isEditing1) {
		const matchPatternArray = editInput1.value.match(/^[A-Z][a-z'-]*[a-z]+[IVX]?[IVX]?[I]{0,2}$|^[А-ЩЭЮЯЁ][а-яё'-]*[а-яё]+[IVX]?[IVX]?[I]{0,2}$/); 

		if(matchPatternArray && title1.textContent !== editInput1.value) {
		  title1.textContent = editInput1.value;
		  this.textContent = 'Изменить Имя' ;

   		  const index = [].indexOf.call(userList.querySelectorAll('.user-item'),listItem);
	      array[index].name = title1.textContent;
	      console.log(`новое имя пользователя ${index} = ${array[index].name}`); 

	      console.log( array );  

		} else if (!matchPatternArray) {
          title1.textContent = title1.textContent;
          alert('Вы ввели недопустимые символы в названии имени');
          this.textContent = 'Изменить Имя' ;
		} else  this.textContent = 'Изменить Имя' ;                    
			           
	} else {  // сохранения данных
		editInput1.value = title1.textContent;
		this.textContent = 'Сохранить Имя';
	}

	listItem.classList.toggle('editing1') // переход в блок  редактирования
};


function editItem2(event) {                                  // редактирование возраста пользователя
	const listItem = this.parentNode;                          
	const title2 = listItem.querySelector('.title2');           
	const editInput2 = listItem.querySelector('.textfield2');    

	const isEditing2 = listItem.classList.contains('editing2');   

	if(isEditing2) {
		const matchPatternArray = editInput2.value.match(/^[0-9]{1,2}$|^[1][0,1][0-9]$/);		
		if(matchPatternArray && parseInt(title2.textContent) != editInput2.value) {
			console.log('editInput2.value = ' + editInput2.value);
			console.log('parseInt(title2.textContent) = ' + parseInt(title2.textContent) );
			
			title2.textContent = editInput2.value;
			this.textContent = 'Изменить Возраст' ;

			const index = [].indexOf.call(userList.querySelectorAll('.user-item'),listItem);
	        array[index].age = editInput2.value;

	        createSuffix(title2.textContent,index);
	        title2.textContent += ' ' + array[index].suffix;

	        console.log( array );  

		} else if (!matchPatternArray) {
			alert('Допустимое значение возраста: 0 - 119');
		} else this.textContent = 'Изменить Возраст' ;
		
			           
	} else {
		editInput2.value = parseInt(title2.textContent);
		this.textContent = 'Сохранить Возраст';
	}

	listItem.classList.toggle('editing2')
};



function deleteItem(event) {        // удаление одного пользователя                        
	const listItem = this.parentNode; 

	const index = [].indexOf.call(userList.querySelectorAll('.user-item'),listItem);

	console.log( 'удалился indexOf = '+ index );  // индекс в массиве данных всех пользователей

	array.splice(index,1); // удаление объекта данных  пользователя из массива

	userList.removeChild(listItem);  //удаление элемента в DOM

	switchSortButtons(); // после удаления доступны клавиши сортировки (если количество пользователей от двух)

	console.log( array );

};

    
	const userList = createElement('ul', {className:'user-list'}); // контейнер элементов DOM . элементами являются строки с данными пользователя
	main.insertBefore(userList, deletecheckedAndUncheckAll); // вставка перед кнопками 'удалить отмеченные' и 'снять все галочки'

    
	 buttonDeleteChecked.addEventListener('click', deleteChecked); // 'удалить отмеченные'
	 buttonUnChecked.addEventListener('click', unChecked );        // 'снять все галочки'

	 buttonForNames.addEventListener('click', sortByName);        //сортировка по алфавиту
	 buttonForAges.addEventListener('click', sortByAge);          // сортировка по возрасту

  
function deleteChecked(event) {                      // удаление отмеченных пользователей   
const userItems = document.querySelectorAll('.user-item');
    event.preventDefault();
    const deleteButtons = document.querySelectorAll('.delete');  //все кнопки 'удалить'
    [].forEach.call(deleteButtons, button => button.disabled = false); // отключение

        
   console.log('удалить отмеченные')


	let i =0;

	for (key of Object.keys(userItems) ) {   //  удаление объектов данных пользователей, выделенных флажками, из массива 
		if (userItems[key].firstChild.checked === true) {
			 
			 array.splice(key-i,1);
			 console.log(`удалились индексы:  ${key}`);
			userList.removeChild(userItems[key]) ;  // и из DOM
		    i++;
		}
 	 };

  switchDeleteCheckedAndUncheckAll(true); // 'удалить отмеченные' и 'снять все галочки' активны
  switchSortButtons();    // становятся доступными клавиши сортировки (если количество пользователей от двух)

  console.log( array );

};

function unChecked(event) {  // ищет все установленные флажки(галочки) и их снимает
	
	Array.from(main.querySelectorAll('.completed')).forEach( box => {
	  box.querySelector('.checkbox').checked = false, 
	  console.log(box.querySelector('.checkbox')),
	  box.classList.remove('completed');
    }) ;

    Array.from(main.querySelectorAll('.delete')).forEach( button => { // после чего включает все кнопки 'удалить'
    	button.disabled = false;
    });
    
  switchDeleteCheckedAndUncheckAll(true);
  switchSortButtons();

    console.log('снять отмеченные') 
};

function switchSortButtons(force) { // включает/выключает кнопки сортировки и регулирует их прозрачность

if(force) {
	   buttonForNames.disabled = true; //по алфавиту
   	   buttonForAges.disabled = true;  // по имени
   	   sortButtons.classList.add('hideSortButtons'); // прозрачность
     	 
   	} else if(array.length >= 2){ // если в массиве(а значит и в DOM) элементов <2 , то нет смысла активизировать кнопки сортировки
   		buttonForNames.disabled = false;
   	    buttonForAges.disabled = false;
   	    sortButtons.classList.remove('hideSortButtons');
   	} else switchSortButtons(true);
   	  
};

function switchDeleteCheckedAndUncheckAll(off) {  // включает/выключает кнопки 'удалить отмеченные' и 'снять все галочки'
	if(off) {
		deletecheckedAndUncheckAll.classList.add('notselectdeletechecked');
        buttonDeleteChecked.classList.remove('buttondeletechecked');
        buttonDeleteChecked.disabled = true;
     	buttonUnChecked.disabled = true;
     } else {
     	buttonDeleteChecked.classList.add('buttondeletechecked'); 
   	    buttonDeleteChecked.disabled = false;
   	    buttonUnChecked.disabled = false;
   	    deletecheckedAndUncheckAll.classList.remove('notselectdeletechecked');
     };	
};


function sortByName(event) {  // сортировка по имени
	console.log('сорт бай алфавит');

	buttonForAges.className = '';  // удаляет треугольник сортировки с другой кнопки

	sortDirection(buttonForNames);  // переключение направления сортировки по алфавиту.

		  
	const userItems =Array.from(document.querySelectorAll('.user-item'));  // все пользователи
    const itemsSortByName = userItems.sort(makeSortByName('name', 'age'));    // массив отсортированных элементов , callback - функция сортировки по алфавиту 

    function makeSortByName (name, age) { // функция для сортировки по имени
      return function (a, b) {
 	    if( a.children[1].textContent ===  b.children[1].textContent) { // если одинаковые имена 
 		   return  parseInt(b.children[2].textContent) - parseInt(a.children[2].textContent); // то по убыванию возраста
 	    } if(buttonForNames.className === 'increaseSort') {                         // направление сортировки в зависимости от текущего класса у элемента
 	        return a.children[1].textContent > b.children[1].textContent ? 1 : -1;
        } return a.children[1].textContent < b.children[1].textContent ? 1 : -1;
      }
    };

	let i =0;
	itemsSortByName.forEach(item => {    // элементамам отсортированным задаётся возрастающий параметр order flexbox для перерисовывания интерфейса 
      console.log(item,i), item.style.order = i ,i++;
	});
};


 function sortDirection(button) {          // изменяет направление сортировки с помощью присвоения одного и удаления другого класса
		if (button.className === 'decreaseSort' || !(button.className === 'decreaseSort' || button.className === 'increaseSort')) {
			button.classList.remove('decreaseSort');
			button.classList.add('increaseSort');
		} else if (button.className === 'increaseSort') {
			button.classList.remove('increaseSort');
			button.classList.add('decreaseSort');
		}
	};


function sortByAge(event) {
	console.log('сорт бай возраст');

	buttonForNames.className = ''; // удаляет треугольник сортировки с другой кнопки

	sortDirection(buttonForAges); // переключение направления сортировки по возрасту.

	
	const userItems =Array.from(document.querySelectorAll('.user-item'));
	const itemsSortByAge = userItems.sort( makeSortByAge('age', 'name'));    //массив отсортированных элементов, callback - функция сортировки по возрасту 



	 function makeSortByAge (age, name) { // функция для сортировки по возрасту
      return function (a, b) {
 	    if( parseInt(b.children[2].textContent) ===  parseInt(a.children[2].textContent)) {     // если одинаковый возраст
 		   return  a.children[1].textContent > b.children[1].textContent ? 1 : -1;              // то по алфавиту (по возрастанию А-Я)
 	    } if(buttonForAges.className === 'increaseSort') {                                    // направление сортировки в зависимости от текущего класса у элемента
 	        return parseInt(a.children[2].textContent) - parseInt(b.children[2].textContent);
        } return parseInt(b.children[2].textContent) - parseInt(a.children[2].textContent);
       }
     };
 
    let i =0;
	itemsSortByAge.forEach(item => {       // элементамам отсортированным задаётся возрастающий параметр order flexbox для перерисовывания интерфейса
      console.log(item,i), item.style.order = i ,i++;
	});

};


//

const array = []; // массив данных пользователей



document.forms.users.addEventListener('submit', addUser); // кнопка добавления нового пользователя

function addUser(event){  
	event.preventDefault(); // чтобы страница не перезагрузилась
	const indexUser = array.length;  // индекс в масиве данных
    array.splice(indexUser,0,{name: this.name.value, age: this.age.value}); //добавление данные пользователя в массив
    console.log('длина массива = ' + array.length);
    const  userAge = this.age.value;    // возраст
    createSuffix(userAge,indexUser); // лет/год/года
    addItem(event,indexUser);  // процесс создания элемента в DOM c данными пользователя
    resetForm();  //очистка формы после ее отправки в массив
    document.forms.users.children[0].children[2].children.name.focus(); // после добавления пользователя переключается фокус на поле ввода имени нового пользователя 

}; 


function resetForm(event) {   //очистка формы ввода данных пользователя после отправки данных
	document.forms.users.elements.name.value = '';
	document.forms.users.elements.age.value = '';
  document.forms.users.elements.day.value = '';
  document.forms.users.elements.comment.value = '';
};


})();



