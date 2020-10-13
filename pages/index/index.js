import { options, tip } from '../constant'

Page({
  data: {
    headerTitle: '请选择学历',
    modalData: options.education,
    isModal: false,
    tip,
    emailList: [],
    formData: {
      education: '',
      marriage: '',
      income: '',
      usage: '',
      housing: '',
      relation: '',
      email: '',
      locations: '',
      contacts: ''
    }
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onItemTap(choise) {
    const data = options[choise].map(itm => {
      if(itm.label === this.data.formData[choise]) {
        return {...itm, isCheck: true}
      } else {
        return {...itm, isCheck: false}
      }
    })
    this.setData({
      headerTitle: tip[choise].title,
      modalData: data,
      isModal: true,
      current: choise
    });
    this.hideKeyBoard()
  },
  hideKeyBoard() {
    my.hideKeyboard();
  },
  onModalClose() {
    this.setData({
      isModal: false
    })
  },
  onItemClick(value) {
    let label = '';
    const newData = this.data.modalData.map(item => {
      if(item.value === value) {
        label=item.label;
        return {...item, isCheck: true};
      } else {
        return {...item, isCheck: false};
      }
    })
    this.setData({
      modalData: newData,
      formData: {...this.data.formData, [this.data.current]: label}
    })
    this.onModalClose()
  },
  onCompanyTap(choise) {
    this.setData({
      current: choise
    })
  },
  onCityTap(choise) {
    this.setData({
      current: choise
    })
    const _this = this;
    // my.chooseLocation({
    //   success:(res)=>{
    //     console.log(JSON.stringify(res))
    //     const { provinceName } = res;
    //     console.log(JSON.stringify(provinceName))
    //     _this.setData({
    //       formData: {..._this.data.formData, [_this.data.current]: provinceName}
    //     })
    //   },
    //   fail:(error)=>{
    //     my.alert({content: '调用失败：'+JSON.stringify(error), });
    //   }
    // });
    this.hideKeyBoard()
    my.call('getLocation1', {}, ({ data, error }) => {
      if (error === 1) {
        console.log('请前往自定义设置注册JSAPI');
      } else {
        const city = data.city;
        _this.setData({
          formData: {..._this.data.formData, [_this.data.current]: city}
        })
      }
    })
  },
  onContactsTap(choise) {
    this.setData({
      current: choise
    })
    const _this = this;
    this.hideKeyBoard()
    my.call('getContact', {}, ({ data, error }) => {
      if (error === 1) {
        console.log('请前往自定义设置注册JSAPI');
      } else {
        const contactPhone = data.contactPhone;
        _this.setData({
          formData: {..._this.data.formData, [_this.data.current]: contactPhone}
        })
      }
    })
  },
  onEmailInput(val) {
    let data = [];
    if(val.indexOf('@') > 0) {
      data = options.email.map(itm => {
        return val + itm;
      })
    }
    this.setData({
      emailList: data
    })
  },
  onListTap(value) {
    this.setData({
      formData: {...this.data.formData, email: value},
      emailList: []
    })
  },
  onEmailTap() {
  },
  onItemBlur(input) {
    if(input.indexOf('@') < 0) {
      console.log('请输入正确邮箱格式');
    }
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '个人信息',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
