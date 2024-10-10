const ethUrl = 'https://rpc.ankr.com/eth';
const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

const web3 = new Web3(new Web3.providers.HttpProvider(ethUrl));

const usdtAbi = [
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function",
    }
];

async function getEthBalance(address) {
    try {
        const balanceWei = await web3.eth.getBalance(address);
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
        return balanceEth;
    } catch (error) {
        console.error('Error fetching ETH balance:', error);
        throw error;
    }
}

async function getUsdtBalance(address) {
    try {
        const usdtContract = new web3.eth.Contract(usdtAbi, usdtAddress);
        const balance = await usdtContract.methods.balanceOf(address).call();
        const balanceFormatted = web3.utils.fromWei(balance, 'mwei');
        return balanceFormatted;
    } catch (error) {
        console.error('Error fetching USDT balance:', error);
        throw error;
    }
}

document.getElementById('checkBalance').addEventListener('click', async () => {
    const address = document.getElementById('ethAddress').value.trim();
    const resultDiv = document.getElementById('result');

    resultDiv.innerHTML = '';

    if (!web3.utils.isAddress(address)) {
        resultDiv.innerHTML = '<p class="error">Invalid Ethereum address, please enter again.</p>';
        return;
    }

    resultDiv.innerHTML = '<p class="loading">waiting...</p>';

    try {
        const [ethBalance, usdtBalance] = await Promise.all([
            getEthBalance(address),
            getUsdtBalance(address)
        ]);

        resultDiv.innerHTML = `
            <p><strong>Address：</strong>${address}</p>
            <p><strong>ETH Balance：</strong>${ethBalance} ETH</p>
            <p><strong>USDT Balance：</strong>${usdtBalance} USDT</p>
        `;
    } catch (error) {
        resultDiv.innerHTML = '<p class="error">Error.</p>';
    }
});
