import Taro, { Component, Config, showLoading, hideLoading } from '@tarojs/taro';
import { View, Text, Input, Checkbox, Radio, CheckboxGroup, Button, Image } from '@tarojs/components';
import './index.scss';
import icon_close from './icon_close.png'
import { connect } from '@tarojs/redux';

import * as actions from '../../actions/index'

const isWx = process.env.TARO_ENV == 'weapp';

const mapStateToProps = ({ manageTodos }) => ({
  todos: manageTodos.todos,
  isAllChecked: manageTodos.isAllChecked,
  checkedCount: manageTodos.checkedCount
})

/**
 * mapStateToProps 前者负责输入逻辑 即将state映射到 UI 组件的参数（props）
 * 
 * mapDispatchToProps 后者负责输出逻辑，即将用户对 UI 组件的操作映射成 Action
 */
@connect(mapStateToProps, (dispatch) => ({
  add(input) {
    dispatch(actions.add(input))
  }, deleteByIndex(index) {
    dispatch(actions.deleteByIndex(index))
  }, onMouseOver(index) {
    dispatch(actions.onMouseOver(index))
  }, clickTodosByIndex(index) {
    dispatch(actions.clickTodosByIndex(index))
  }, sxxxxx() {
    dispatch(actions.clickAllCheckbox())
  }, clearTodos() {
    dispatch(actions.clearTodos())
  }
}))
export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount() { }

  /**
   * shouldComponentUpdate 函数返回布尔值 默认为true，若为false，则后续的render函数不讲执行 使用得当能提高React性能
   * 
   * true React 接下来就会依次调用对应组件的 componentWillUpdate、render 和 componentDidUpdate 函数
   */
  // shouldComponentUpdate() { }

  /**
   * render 函数被调用完之后，并非立即调用，是render函数返回的内容已经渲染到DOM树上，此时才触发此函数
   */
  componentDidMount() { }

  componentWillUnmount() { }

  /**
   * 在 render 函数里面被谊染的子组件就会经历更新过程，不管父组件传给子组件的 props 有没有改变，都会触发子组件的 componentWillReceiveProps 函数
   */
  componentWillReceiveProps() { }

  componentDidShow() { }

  componentDidHide() { }

  state = {
    inputContent: '',
  }

  saveNewTodo(e) {
    let { add } = this.props
    if (!e.detail.value) return;
    add(e.detail.value)
    this.setState({
      inputContent: ''
    });
  }

  render() {

    let {
      todos
      , isAllChecked
      , checkedCount
      , deleteByIndex
      , onMouseOver
      , clickTodosByIndex
      , clearTodos
      , sxxxxx } = this.props

    const todosJsx = todos.map((item, index) => {
      return (<View className='index_list_item' onMouseOver={onMouseOver.bind(this, index)}>
        <Checkbox
          checked={item.checked}
          onClick={clickTodosByIndex.bind(this, index)} />
        <Text
          className={item.checked ? 'index_list_item_txt_line' : 'index_list_item_txt'}
          onClick={clickTodosByIndex.bind(this, index)}>{item.txt}</Text>
        <Image
          className='index_list_item_img_close'
          style={{ display: isWx ? 'flex' : item.showClose ? 'flex' : 'none' }}
          src={icon_close}
          onClick={deleteByIndex.bind(this, index)} />
      </View>
      )
    });

    return (
      <View className='index'>
        <Text className='index_top'>TODOS</Text>
        <Input
          type='text'
          className='index_input'
          value={this.state.inputContent}
          placeholder={'What needs to be done?'}
          autoFocus={true}
          onConfirm={this.saveNewTodo.bind(this)} />
        <View className='index_tip'>
          <Checkbox
            checked={isAllChecked}
            onClick={sxxxxx}>
            <Text onClick={sxxxxx}>Mark all as complete</Text>
          </Checkbox>
        </View>
        <View className='index_list' style={{ display: todos.length == 0 ? 'none' : 'flex' }} >
          {todosJsx}
        </View>
        <View className='index_bottom'>
          <Button onClick={clearTodos}>
            清除（{checkedCount}）个完成选项
          </Button>
        </View>
      </View>
    );
  }
}