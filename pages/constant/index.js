const education = [{
  label: '小学',
  value: 'primary'
}, {
  label: '初中',
  value: 'junior'
}, {
  label: '高中',
  value: 'high'
}, {
  label: '大学',
  value: 'university'
}, {
  label: '本科',
  value: 'course'
}, {
  label: '硕士',
  value: 'master'
}, {
  label: '博士',
  value: 'doctor'
}]

const marriage = [{
  label: '已婚',
  value: 'married'
}, {
  label: '未婚',
  value: 'unmarried'
}, {
  label: '其他',
  value: 'other'
}]

const income = [{
  label: '1千以下',
  value: 'less_1_thousand'
}, {
  label: '1-3千',
  value: 'less_3_thousand'
}, {
  label: '3-5千',
  value: 'less_5_thousand'
}, {
  label: '5千-1万',
  value: 'less_10_thousand'
}, {
  label: '1-2万',
  value: 'less_20_thousand'
}, {
  label: '2万以上',
  value: 'more_20_thousand'
}]

const usage = [{
  label: '装修',
  value: 'decorate'
}, {
  label: '婚庆',
  value: 'wedding'
}, {
  label: '旅游',
  value: 'travel'
}, {
  label: '教育',
  value: 'education'
}, {
  label: '租房',
  value: 'rent'
}, {
  label: '医疗',
  value: 'medical'
}, {
  label: '汽车周边',
  value: 'cararound'
}]

const housing = [{
  label: '自有住房，有房贷记录',
  value: 'loan'
}, {
  label: '自有住房，无房贷',
  value: 'noloan'
}, {
  label: '其他',
  value: 'other'
}]

const relation = [{
  label: '家人',
  value: 'family'
}, {
  label: '朋友',
  value: 'friend'
}, {
  label: '同事',
  value: 'colleague'
}, {
  label: '其他',
  value: 'other'
}]

const tip = {
  education: { label: '学历', placeholder: '请选择您的学历', title: '请选择学历' },
  marriage: { label: '婚姻', placeholder: '请选择您的婚姻状况', title: '请选择婚姻' },
  email: { label: '邮箱', placeholder: '请填写您的常用邮箱' },
  company: { label: '公司名称', placeholder: '请填写您的公司名称' },
  city: { label: '所在城市', placeholder: '请定位您的所在城市' },
  income: { label: '平均月收入', placeholder: '请选择您的税后月收入范围', title: '请选择平均月收入' },
  usage: { label: '贷款用途', placeholder: '请选择您的贷款用途', title: '请选择贷款用途' },
  housing: { label: '房屋信息', placeholder: '请选择您的房屋信息', title: '请选择房屋信息' },
  contacts: { label: '紧急联系人', placeholder: '请选取您的联系人' },
  relation: { label: '关系', placeholder: '请选择您与联系人的关系', title: '请选择联系人的关系' },
}

const email = ['qq.com', '163.com', '126.com']

const locations = {
  data: {
    address: '上海市浦东新区哈雷路靠近长泰广场E座',
    city: '上海市',
    countryTown: '浦东新区',
    meridian: '121.603379',
    parallel: '31.206294',
    province: '上海市'
  },
  success: true
}

const contacts = {
  data: {
    contactName: '12😀3父',
    contactPhone: '16621125666'
  },
  success: true
}

const options = {
  education,
  marriage,
  income,
  usage,
  housing,
  relation,
  email,
  locations,
  contacts
}

export { tip, options }