/**
 * 金额相关hook
 */

export function useFmtAmount() {
  // 限制输入的金额格式
  function integerInputAmount(item: any, prop: string) {
    item[prop] = amountIntegerInput(item[prop])
  }

  // 限制输入的金额格式
  function limitInputAmount(item: any, prop: string, flag = false) {
    if (flag) {
      item[prop] = amountLimitInputSmall(item[prop])
    } else {
      item[prop] = amountLimitInput(item[prop])
    }
  }

  // 格式化金额
  function formatAmount(item: any, prop: string) {
    item[prop] = amountFormat(item[prop])
  }

  // 还原格式化金额
  function unFormatAmount(item: any, prop: string) {
    item[prop] = amountUnFormat(item[prop])
  }

  // 金额转为中文大写
  function upperChineseAmount(item: any, prop?: string) {
    if (prop) {
      return amountToChinese(amountUnFormat(item[prop]))
    } else {
      return item ? amountToChinese(amountUnFormat(item)) : ''
    }
  }

  // 限制只能输入数字且为整数
  function amountIntegerInput(num: string) {
    const val = String(num).replace(/[^\d.]/g, '') // 清除'数字'和'.'外的字符
    return val.split('.')[0]
  }

  // 限制只能输入数字且最多允许小数点两位
  function amountLimitInput(num: string) {
    let val = String(num).replace(/[^\d.]/g, '') // 清除'数字'和'.'外的字符
    val = val.replace(/\.{2,}/g, '.') // 只保留第一个.
    return val.replace(/^(\-)*(\d+)\.(\d{2}).*$/, '$1$2.$3')
  }

  // 允许负数
  function amountLimitInputSmall(num: string) {
    let val = String(num).replace(/[^\d.(\-)]/g, '') // 清除'数字'和'.'外的字符
    val = val.replace(/\.{2,}/g, '.') // 只保留第一个.
    return val.replace(/^(\-)*(\d+)\.(\d{2}).*$/, '$1$2.$3')
  }

  // 格式化金额
  function amountFormat(num: any) {
    if (num || num == '0') {
      if (String(num).indexOf(',') > -1) {
        return num
      } else {
        return Number(num)
          .toFixed(2)
          .replace(/(\d)(?=(\d{3})+($|\.))/g, '$1,')
      }
    }
    return num
  }

  // 还原格式化金额
  function amountUnFormat(num: string | number) {
    if (num) {
      return String(num).replace(/[^\d\.-]/g, '')
    }
    return num
  }

  // 金额转为中文大写
  function amountToChinese(money: string | number) {
    const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'] //汉字的数字
    const cnIntRadice = ['', '拾', '佰', '仟'] //基本单位
    const cnIntUnits = ['', '万', '亿', '兆'] //对应整数部分扩展单位
    const cnDecUnits = ['角', '分', '毫', '厘'] //对应小数部分单位
    const cnInteger = '整' //整数金额时后面跟的字符
    const cnIntLast = '元' //整数完以后的单位
    //最大处理的数字
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    const maxNum = 999999999999999.9999
    //输出的中文金额字符串
    let chineseStr = ''
    let isNegative = false
    if (money === '') {
      return ''
    }
    if (money === '-') {
      return '负'
    }
    if (Number(money) < 0) {
      isNegative = true
      money = Math.abs(Number(money))
    }

    money = parseFloat(money as any)
    if (money >= maxNum) {
      //超出最大处理数字
      return '超出最大处理数字'
    }
    if (money == 0) {
      chineseStr = cnNums[0] + cnIntLast + cnInteger
      return chineseStr
    }
    //四舍五入保留两位小数,转换为字符串
    money = Math.round(money * 100).toString()
    const integerNum = money.substr(0, money.length - 2) //金额整数部分
    const decimalNum = money.substr(money.length - 2) //金额小数部分
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
      let zeroCount = 0
      const IntLen = integerNum.length
      for (let i = 0; i < IntLen; i++) {
        const n = integerNum.substr(i, 1)
        const p = IntLen - i - 1
        const q = p / 4
        const m = p % 4
        if (n == '0') {
          zeroCount++
        } else {
          if (zeroCount > 0) {
            chineseStr += cnNums[0]
          }
          //归零
          zeroCount = 0
          chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
        }
        if (m == 0 && zeroCount < 4) {
          chineseStr += cnIntUnits[q]
        }
      }
      chineseStr += cnIntLast
    }
    //小数部分
    if (decimalNum != '') {
      const decLen = decimalNum.length
      for (let i = 0; i < decLen; i++) {
        const n = decimalNum.substr(i, 1)
        if (n != '0') {
          chineseStr += cnNums[Number(n)] + cnDecUnits[i]
        }
      }
    }
    if (chineseStr == '') {
      chineseStr += cnNums[0] + cnIntLast + cnInteger
    } else if (decimalNum == '' || /^0*$/.test(decimalNum)) {
      chineseStr += cnInteger
    }

    return isNegative ? `负${chineseStr}` : chineseStr
  }

  function formatNumber(num: any) {
    if (!num && num !== 0) return ''
    num = Number(num)
    if (num == 0 || (num > 0 && num < 10000)) {
      return num / 10000
    } else {
      return (num / 10000).toFixed(2)
    }
  }
  return {
    formatNumber,
    limitInputAmount,
    formatAmount,
    unFormatAmount,
    upperChineseAmount,
    integerInputAmount,
    amountLimitInput,
    amountFormat,
    amountUnFormat,
    amountToChinese,
  }
}
