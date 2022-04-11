<template>
  <div class="test">

    <div style="height: auto;width: 100%;">

      <div style="width: 1100px;margin-left:10%;height: auto;">

        <div style="padding-bottom: 30px;">
          <h4>ETH小工具</h4>
          <span>version:{{ version }}</span>
          <el-button size="mini" type="primary" style="margin-left: 20px;" @click="checkMetaMask">Check MetaMask
          </el-button>
        </div>

        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="生成钱包" name="1">
            <el-input style="width: 150px;" size="mini" clearable placeholder="钱包数量" v-model="ethWalletNum"></el-input>
            <el-button size="mini" type="primary" style="margin-left: 20px;" @click="generateWallet">确定</el-button>
            <el-button type="danger" size="mini" @click="clearWallet">清空</el-button>
            <el-button type="warning" size="mini" @click="exportWalletExcel">导出</el-button>

            <el-table
              :data="ethWalletList"
              style="width: 100%;margin-top: 30px;"
              border
              :row-class-name="tableRowClassName">
              <el-table-column
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                label="钱包地址"
                width="430">
                <template slot-scope="scope">
                  <div>
                    <span>{{ scope.row.address }}</span>
                    <a style="color:#67c23a;cursor: pointer;margin-left: 5px;"
                       v-clipboard:copy="scope.row.address"
                       v-clipboard:success="onCopy"
                       v-clipboard:error="onError">复制</a>
                  </div>
                </template>

              </el-table-column>
              <el-table-column
                label="私钥">
                <template slot-scope="scope">
                  <div>
                    <span>{{ scope.row.privateKey }}</span>
                    <a style="color:#67c23a;cursor: pointer;margin-left: 5px;"
                       v-clipboard:copy="scope.row.privateKey"
                       v-clipboard:success="onCopy"
                       v-clipboard:error="onError">复制</a>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="查询余额" name="2">
            <el-input style="width: 350px;" clearable size="mini" placeholder="钱包地址"
                      v-model="searchEthAddress"></el-input>
            <el-button size="mini" type="primary" style="margin-left: 20px;" @click="searchEthAmount">查询</el-button>
            <span style="padding-left: 30px;">{{ walletAmount }}</span>
          </el-collapse-item>
          <el-collapse-item title="空投信息网站" name="3">
            <template>
              <el-table
                :data="airdropData"
                style="width: 100%"
                :row-class-name="tableRowClassName">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50">
                </el-table-column>
                <el-table-column
                  label="网站"
                  width="300">
                  <template slot-scope="scope">
                    <el-link :underline="false" :href="scope.row.site" target="_blank" type="primary">{{
                        scope.row.site
                      }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="备注">
                </el-table-column>
              </el-table>
            </template>

          </el-collapse-item>
          <!--          <el-collapse-item title="可控 Controllability" name="4">-->
          <!--            <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>-->
          <!--            <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>-->
          <!--          </el-collapse-item>-->
        </el-collapse>


      </div>

    </div>
  </div>
</template>
<script>
import Web3 from "web3";
import FileSaver from 'file-saver'
// import XLSX from "../util/excel/XLSX";
import XLSX from 'xlsx';
import xlsxStyle from 'xlsx-style';


export default {
  name: 'TestMain',
  data() {
    return {
      version: '1.0.0.1',
      ethWalletNum: null,
      ethWalletList: [],
      activeNames: ['1', '3'],
      searchEthAddress: '',
      walletAmount: '',
      airdropData: [
        {site: 'https://airdrops.io/', remark: '有空投教程，用户可以对项目进行评分'},
        {site: 'https://airdropalert.com/', remark: '有空投教程，对参与门槛进行了标注，用户可以对项目进行评分'},
        {site: 'https://dropsearn.com/airdrops/', remark: 'N/A'},
        {site: 'https://earni.fi/', remark: '可以查询未申领空投'},
        {site: 'https://airdropbob.com', remark: '有空投教程，对参与门槛进行了标注，用户可以对项目进行评分，有空投日历页面'},
        {site: 'https://coinmarketcap.com/airdrop/', remark: '有空投教程，显示空投参与情况'},
        {site: 'https://pinoffers.com/', remark: '有空投教程，用户可以评论互动'},
        {site: 'https://dappradar.com/hub/airdrops', remark: '项目少，对参与门槛进行了标注，可以查看空投获奖地址'},
        {site: 'https://defillama.com/airdrops', remark: '提供数据型空投信息'},
        {site: 'https://airdropking.io', remark: '有空投教程，对参与门槛进行了标注，用户可以对项目进行评分'},
        {site: 'https://grabairdrop.com/', remark: '项目少，有空投教程，用户可以对项目进行评分，对参与门槛进行了标注'},
        {site: 'https://www.deficalendar.xyz/', remark: '有空投教程'},
        {site: 'https://www.terradrops.io/', remark: '专注Terra生态，可以查询未申领空投，一键申领'},
        {site: 'https://coinowo.com/', remark: '有中文交互教程'},
        {site: 'https://mirror.xyz/kongtoudawo.eth/', remark: '有中文交互教程'},
        {site: 'https://mirror.xyz/nbblockchain.eth', remark: '有中文交互教程'},
      ]
    }
  },
  mounted() {
    // console.log('enter test main page')
  },
  methods: {
    currentProvider() {
      // console.log(`web3.version:${Web3.version}`)
      let web3Provider;
      if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
          // 请求授权
          window.ethereum.enable();
        } catch (error) {
          // console.error(error)
          // 拒绝授权
          // console.error('用户拒绝授权')
          this.$message.error(error);
        }
      } else if (window.web3) {
        // console.log('window.web3')
      }
      let web3js = new Web3(web3Provider);
      return web3js;
    },
    checkMetaMask() {
      let self = this;
      let web3js = this.currentProvider();
      web3js.eth.getAccounts(function (error, accounts) {
        self.$message.success(`当前钱包地址【${accounts[0]}】`)
      });


      // let privateKeyToAccount = web3js.eth.accounts.privateKeyToAccount('0x0303015435438711ab7d78899a9c977928ded6c483421c6954e971d960fe8709');
      // console.log(`privateKeyToAccount account:${privateKeyToAccount.address}  privateKeyToAccount key:${privateKeyToAccount.privateKey}`)


      // let v3Json = web3js.eth.accounts.encrypt('0x0303015435438711ab7d78899a9c977928ded6c483421c6954e971d960fe8709', 'Carolin520');
      // console.log(v3Json)


      // let balance = web3js.eth.getBalance('0x26fd1eDa4f397309Dca4CEC5C041AB9478F54A34');
      // console.log(balance)
      //
      // let fromWei = web3js.utils.fromWei(balance, 'ether');
      // console.log(fromWei)

      // console.log(web3js.eth.ens)
    },
    generateWallet() {
      this.ethWalletList = [];
      let web3js = this.currentProvider();
      let ethWalletNum = this.ethWalletNum;
      if (ethWalletNum) {
        // console.log(`需要生成的钱包数量:${ethWalletNum}`)
        let account = web3js.eth.accounts.wallet.create(parseInt(ethWalletNum), 'Carolin520');
        // console.log(account)
        // console.log(account.length)
        for (let i = 0; i < account.length; i++) {
          // console.log(account[i].address)
          let privateKey = account[i].privateKey;
          if (privateKey.startsWith('0x')) {
            privateKey = privateKey.substr(2, privateKey.length);
          }
          this.ethWalletList.push({
            address: account[i].address,
            privateKey: privateKey
          });
        }
      } else {
        this.$message.error('请输入数量');
      }
    },
    searchEthAmount() {
      // console.log('查询钱包余额')
      try {
        if (!this.searchEthAddress) {
          return this.$message.error('请输入钱包地址');
        }
        let web3js = this.currentProvider();
        let balance = web3js.eth.getBalance(this.searchEthAddress);
        // console.log(balance)
        balance.then((item) => {
          // console.log(item)
          let s = web3js.utils.fromWei(item, 'ether');
          // console.log(s)
          this.walletAmount = s;
        });
      } catch (err) {
        // console.error(err)
        this.$message.error(err);
      }
    },
    clearWallet() {
      this.ethWalletList = [];
      this.ethWalletNum = '';
      this.walletAmount = '';
    },
    getComputedData() {
      let ethWalletList = this.ethWalletList;
      let itemData = {};
      let arr = []
      this.ethWalletList.map(item => {
        itemData.address = item.address;
        itemData.privateKey = item.privateKey;
        arr.push(itemData);
        itemData = {}; //注意要将其清空，然后再重新遍历
      });
      return arr;
    },
    exportWalletExcel() {
      // console.log('导出Excel')

      let ethWalletList = this.ethWalletList;
      if (ethWalletList.length < 1) {
        return this.$message.error('请先生成地址');
      }
      this.exportExcel();
    },
    exportExcel() {
      let ethWalletList = this.ethWalletList;


      let data = [['钱包地址', '妥善保管的【私钥】']];
      for (let i = 0; i < ethWalletList.length; i++) {
        const item = ethWalletList[i];
        data.push([item.address, item.privateKey]);
      }

      // console.log(data);
      let titles = ['钱包地址', '妥善保管的【私钥】']
      var sheet = XLSX.utils.json_to_sheet(data, {
        skipHeader: true,
      });
      /**设置标题头背景色 */
      for (const key in sheet) {
        // 第一行，表头
        if (key.replace(/[^0-9]/ig, '') === '1') {
          sheet[key].s = {
            fill: { //背景色
              fgColor: {rgb: 'FF0000'}
            },
            font: {//字体
              name: '宋体',
              sz: 12,
              bold: true,
              color: {rgb: "FFFFFF"},
            },
            border: {//边框
              bottom: {
                style: 'thin',
                color: 'FF000000'
              }
            },
            alignment: {
              horizontal: 'left' //水平居中
            }
          }
        }
        let colsP = titles.map((item, index) => {
          // console.log(item + ' ---- ' + index)
          var obj = {};
          if (index == 0) {
            //列宽
            obj.wch = 46;
          } else if (index == 1) {
            obj.wch = 65;
          }
          return obj;
        })
        sheet['!cols'] = colsP;//列宽
      }
      this.openDownload(this.sheet2blob(sheet, titles.join('-')), "钱包地址Excel文件.xlsx");
    },
    sheet2blob(sheet, sheetName) {
      let wb = XLSX.utils.book_new();
      wb.SheetNames.push(sheetName)
      wb.Sheets[sheetName] = sheet;
      var wbout = xlsxStyle.write(wb, {bookType: '', bookSST: false, type: 'binary'})
      var blob = new Blob([s2ab(wbout)], {type: ""}, sheetName);

      // 字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }

      return blob;
    },
    openDownload(url, saveName) {
      if (typeof url == "object" && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
      }
      var aLink = document.createElement("a");
      aLink.href = url;
      aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event;
      if (window.MouseEvent) event = new MouseEvent("click");
      else {
        event = document.createEvent("MouseEvents");
        event.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
      }
      aLink.dispatchEvent(event);
    },
    onCopy(e) {
      this.$message({
        message: '复制成功！',
        type: 'success'
      })
    },
    onError(e) {
      this.$message({
        message: '复制失败！',
        type: 'error'
      })
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    handleChange(val) {
      // console.log(val);
    }
  }
}
</script>
<style scoped>
.wrapper-div {
}

.wallet-content {
  margin-top: 10px;
  font-size: 12px;
  font-family: 'Dosis', sans-serif;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

</style>
