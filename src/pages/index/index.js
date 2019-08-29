import Taro, { Component, Config, showLoading, hideLoading } from '@tarojs/taro';
import { View, Text, Input, Checkbox, Radio, CheckboxGroup, Button, Image } from '@tarojs/components';
import './index.scss';
import icon_close from './icon_close.png'
import { connect } from '@tarojs/redux';
import { bindActionCreators } from 'redux'
import * as Actions from '../../actions/index'

const isWx = process.env.TARO_ENV == 'weapp';

function mapStateToProps(state) {
  return {
    manageTodos: state.manageTodos.toJS()
  }
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(Actions, dispatch)
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount() {
  }

  componentDidMount() {
    if (isWx) {
      wx.getStorage({
        key: 'value',
        success: (res) => {
          this.setState({
            value: res.data
          })
          this.setCheckedCount(res.data)
          this.setAllChecked(res.data)
        }
      })
    } else {
      let data = JSON.parse(localStorage.getItem('value'));
      this.setState({
        value: data
      })
      this.setCheckedCount(data)
      this.setAllChecked(data)
    }
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  state = {
    value: [],
    inputContent: '',
    isAllChecked: false,
    checkedCount: 0
  }

  /**
   * 保存数据内容
   */
  save = e => {
    var info = new Object();
    info.txt = e.detail.value;
    info.checked = false;
    info.showClose = false;
    let d = this.state.value.concat(info)
    this.saveDataToLocal(d)
    this.setState({
      value: d,
      inputContent: '',
      isAllChecked: false
    })
  }

  /**
   * 保存数据到浏览器/手机内存
   */
  saveDataToLocal = (saveData) => {
    if (isWx) {
      wx.setStorage({
        key: 'value',
        data: saveData,
        success: (res) => {
          console.log('保存成功')
        }
      })
    } else {
      localStorage.setItem('value', JSON.stringify(saveData))
    }
  }

  /**
   * 勾选选项
   */
  doneTodos = (ind) => {
    let data = this.state.value;
    for (let i = 0; i < data.length; i++) {
      if (i == ind) {
        data[i].checked = !data[i].checked
      }
    }
    this.setCheckedCount(data)
    this.setAllChecked(data)
    this.saveDataToLocal(data)
    this.setState({
      value: data
    })
  }

  /**
   * 设置是否全选
   */
  setAllChecked = (data) => {
    let allChecked = data.every((everyItem) => {
      return everyItem.checked
    })
    this.setState({
      isAllChecked: data.length == 0 ? false : allChecked
    })
  }

  /**
   * 底部选择数量更新
   */
  setCheckedCount = (data) => {
    let count = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i].checked) {
        count++
      }
    }
    this.setState({
      checkedCount: count
    })
  }

  /**
   * 点击了全部选中按钮的时候
   */
  clickAllCheckBox = () => {
    let checked = !this.state.isAllChecked
    let data = this.state.value;
    for (let i = 0; i < data.length; i++) {
      data[i].checked = checked
    }
    this.saveDataToLocal(data)
    this.setState({
      value: data,
      isAllChecked: checked,
      checkedCount: checked ? data.length : 0
    })
  }

  /**
   * 清除选中选项
   */
  clearTodos = () => {
    let data = [];
    for (let i = 0; i < this.state.value.length; i++) {
      if (!this.state.value[i].checked) {
        data.push(this.state.value[i])
      }
    }
    this.saveDataToLocal(data)
    this.setState({
      value: data,
      isAllChecked: false,
      checkedCount: 0
    })
  }

  /**
   * 根据index删除选项
   */
  deleteTodosByIndex = (index) => {
    let data = this.state.value;
    data.splice(index, 1)
    this.saveDataToLocal(data)
    this.setState({
      value: data
    })
    this.setAllChecked(data)
    this.setCheckedCount(data)
  }

  render() {
    return (
      <View className='index'>
        <Text className='index_top'>TODOS</Text>
        <Input
          type='text'
          className='index_input'
          value={this.state.inputContent}
          placeholder={'What needs to be done?'}
          autoFocus={true}
          onConfirm={this.save} />
        <View className='index_tip'>
          <Checkbox
            className="index_tip_txt"
            checked={this.state.isAllChecked}
            onClick={() => { this.clickAllCheckBox() }}>
            <Text onClick={() => { this.clickAllCheckBox() }}>Mark all as complete</Text>
          </Checkbox>
        </View>
        <View className='index_list' style={{ display: this.state.value.length == 0 ? 'none' : 'flex' }} >
          {
            this.state.value.map((item, index) => {
              return (
                <View
                  className='index_list_item'
                  onMouseOver={() => {
                    let data = this.state.value;
                    for (let i = 0; i < data.length; i++) {
                      if (i == index) {
                        data[i].showClose = true
                      } else {
                        data[i].showClose = false
                      }
                    }
                    this.setState({
                      value: data
                    })
                  }}>
                  <Checkbox
                    checked={item.checked}
                    onClick={() => { this.doneTodos(index) }} />
                  <Text
                    className={item.checked ? 'index_list_item_txt_line' : 'index_list_item_txt'}
                    onClick={() => { this.doneTodos(index) }}>{item.txt}</Text>
                  <Image
                    className='index_list_item_img_close'
                    style={{ display: isWx ? 'flex' : item.showClose ? 'flex' : 'none' }}
                    src={icon_close}
                    onClick={() => { this.deleteTodosByIndex(index) }} />
                </View>
              )
            })
          }
        </View>
        <View className='index_bottom'>
          <Button onClick={() => { this.clearTodos() }}>
            清除{this.state.checkedCount}个完成选项
          </Button>
        </View>
      </View>
    );
  }
}
