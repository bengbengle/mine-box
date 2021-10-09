/miner/getOrderList  

 
 getWithdraw(string memory _orderId)
 
返回1是可以获取，返回0是不能获取



userOrderInfo 
withdraw 解押 某一订单全部质押量


userinfo 
    0: "3000000000"
    1: "1"
    2: "360"
    3: "1632799180"
    4: "1663903180"
    5: "0"
    6: "0"
    7: "D163279916205641D5A7D80157FDEA"
    8: "M000001"
    9: "vir-0000"
    10: "A16327991556295FB74999561837CB"
    amount: "3000000000"    // 质押adam 
    cycle: "360"
    devId: "vir-0000"
    drawAdam: "0"       / 已提取 adam 
    drawPower: "0"      / 已提取算力 
    drawTime: "1663903180"
    minerNo: "A16327991556295FB74999561837CB"
    orderId: "D163279916205641D5A7D80157FDEA"
    pledgePower: "1"    // 质押算力
    pledgeTime: "1632799180"
    poolCode: "M000001"









 
0x96a0f4d13A836BF8074e37964a90548195da9571
 
getDrawProfit // 可以提取收益 （0至灰）
 
drawProfit // 提取收益
 
userProfitInfo // 

uint256 profit; // 总收益.
uint256 release; // 释放的25%
uint256 lock; //锁仓
uint256 release_xssf; //线性释放

uint256 drawProfit; //已提取的提取收益
    
    // release + release_xssf 


 uint256 totalProfit //全网总收益







