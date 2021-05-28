"use strict";

const ccxt = require("ccxt");
const asciichart = require("asciichart");
const log = require("ololog").configure({locate: false});
const bullish = require("technicalindicators").bullish;
const bearish = require("technicalindicators").bearish;

require("ansicolor").nice;

//-----------------------------------------------------------------------------
async function main() {
	const index = 4; // [ timestamp, open, high, low, close, volume ]

	const ohlcv = await new ccxt.ftx().fetchOHLCV("BTC-PERP", "1d");
	console.clear();
	const lastPrice = ohlcv[ohlcv.length - 1][index]; // closing price
	const series = ohlcv.slice(-200).map((x) => x[index]); // closing price
	const bitcoinRate = ("₿ = $" + lastPrice).green;
	const chart = asciichart.plot(series, {height: 25, padding: "            "});
	log.yellow("\n" + chart, bitcoinRate, "\n");
	var twoDayBullishInput = {
		open: [
			ohlcv[ohlcv.length - 6][1],
			ohlcv[ohlcv.length - 5][1],
			ohlcv[ohlcv.length - 4][1],
			ohlcv[ohlcv.length - 3][1],
			ohlcv[ohlcv.length - 2][1]
		],
		high: [
			ohlcv[ohlcv.length - 6][2],
			ohlcv[ohlcv.length - 5][2],
			ohlcv[ohlcv.length - 4][2],
			ohlcv[ohlcv.length - 3][2],
			ohlcv[ohlcv.length - 2][2]
		],
		close: [
			ohlcv[ohlcv.length - 6][4],
			ohlcv[ohlcv.length - 5][4],
			ohlcv[ohlcv.length - 4][4],
			ohlcv[ohlcv.length - 3][4],
			ohlcv[ohlcv.length - 2][4]
		],
		low: [
			ohlcv[ohlcv.length - 6][3],
			ohlcv[ohlcv.length - 5][3],
			ohlcv[ohlcv.length - 4][3],
			ohlcv[ohlcv.length - 3][3],
			ohlcv[ohlcv.length - 2][3]
		]
	};
	console.log("Bullish", bullish(twoDayBullishInput));
	console.log("Bearish", bearish(twoDayBullishInput));
	return true;
}

setInterval(async () => {
	const promise = new Promise((resolve) => {
		if (main()) {
			resolve();
		}
	});
	await promise;
}, 2000);
