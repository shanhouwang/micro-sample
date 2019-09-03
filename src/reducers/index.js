import { combineReducers } from "redux";
import * as Actions from '../constants/constants'

/**
 * 初始化数据
 */
let local = getTodosFromLocal();

const INITIAL_STATE = {
    todos: local,
    isAllChecked: setAllChecked(local),
    checkedCount: setCheckedCount(local)
}

const isWx = process.env.TARO_ENV == 'weapp';

function getTodosFromLocal() {
    let data = [];
    if (isWx) {
        let wxData = wx.getStorageSync('todos');
        console.log(wxData)
        data = wxData == null || wxData == undefined ? [] : wxData;
    } else {
        let dataNotWx = localStorage.getItem('todos');
        data = dataNotWx == null || dataNotWx == '' ? [] : JSON.parse(localStorage.getItem('todos'));
    }
    return data
}

/**
 * 设置是否全选
 */
function setAllChecked(data) {
    if (data === null || data === undefined) {
        return false
    }
    let allChecked = data.every((everyItem) => {
        return everyItem == null ? false : everyItem.checked
    })
    return data.length == 0 ? false : allChecked
}

/**
 * 底部选择数量更新
 */
function setCheckedCount(data) {
    return data.filter((item) => { return item.checked }).length;
}

/**
 * 保存数据到浏览器/手机内存
 */
function saveDataToLocal(saveData) {
    if (isWx) {
        wx.setStorage({
            key: 'todos',
            data: saveData,
            success: (res) => {
                console.log('saveDataToLocal success')
            }
        })
    } else {
        localStorage.setItem('todos', JSON.stringify(saveData))
    }
}

function manageTodos(state = INITIAL_STATE, action) {
    console.log(action)
    switch (action.type) {
        case Actions.ADD:
            let info = new Object();
            info.txt = action.text;
            info.checked = false;
            info.showClose = false;
            let todos = state.todos.concat(info);
            saveDataToLocal(todos);
            return {
                ...state,
                todos: todos,
                isAllChecked: false
            }
        case Actions.DELETE_BY_INDEX:
            // splice 并不会引发重新render
            state.todos.splice(action.index, 1);
            let dataByDelete = [...state.todos];
            saveDataToLocal(dataByDelete);
            console.log(dataByDelete)
            return {
                ...state,
                todos: dataByDelete,
                isAllChecked: setAllChecked(dataByDelete),
                checkedCount: setCheckedCount(dataByDelete)
            }
        case Actions.ON_MOUSE_OVER:
            let todosOfMouseOver = [];
            state.todos.map((item, index) => {
                if (action.index == index) {
                    item.showClose = true
                } else {
                    item.showClose = false
                }
                todosOfMouseOver.push(item)
            })
            return {
                ...state,
                todos: todosOfMouseOver
            }
        case Actions.CLICK_TODOS_BY_INDEX:
            let newTodos = [];
            state.todos.map((item, index) => {
                if (action.index == index) {
                    item.checked = !item.checked
                }
                newTodos.push(item)
            });
            saveDataToLocal(newTodos)
            return {
                ...state,
                todos: newTodos,
                isAllChecked: setAllChecked(newTodos),
                checkedCount: setCheckedCount(newTodos)
            }
        case Actions.CLICK_ALL_CHECKBOX:
            let checked = !state.isAllChecked
            let dataOfAll = [...state.todos];
            for (let i = 0; i < dataOfAll.length; i++) {
                dataOfAll[i].checked = checked
            }
            saveDataToLocal(dataOfAll)
            return {
                ...state,
                todos: dataOfAll,
                isAllChecked: checked,
                checkedCount: checked ? dataOfAll.length : 0
            }
        case Actions.CLEAR_TODOS:
            let data = [];
            for (let i = 0; i < state.todos.length; i++) {
                if (!state.todos[i].checked) {
                    data.push(state.todos[i])
                }
            }
            saveDataToLocal(data)
            return {
                ...state,
                todos: data,
                isAllChecked: false,
                checked: 0
            }
        default:
            return state;
    }
}

export default combineReducers({
    manageTodos
})