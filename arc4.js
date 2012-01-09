//
// ARC4.js 0.1
// Implementation of the popular RC4 cipher in JavaScript.
// 2012 Nadim Kobeissi
//
// Usage:
// ARC4.encrypt(key, message);
// ARC4.decrypt(key, message);
//
// Notes:
// This implementation discards the first 256 bytes of PRGA output in order to
// mitigate the RC4 keystream bias discovered by Itsik Mantin and Adi Shamir.
//
// License:
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// 

(function(){
	
	var ARC4 = window.ARC4 = {};
	
	function KSA(key) {
		var S = new Array();
		for (var i=0; i!=256; i++) {
			S[i] = i;
		}
		var j = 0;
		for (var i=0; i!=256; i++) {
			j = (j + S[i] + key[i % key.length].charCodeAt(0)) % 256;
			var Si = S[i];
			S[i] = S[j];
			S[j] = Si;
		}
		return S;
	}

	function PRGA(S, n) {
		var i = 0;
		var j = 0;
		var K = new Array();
		for (var o=0; o!=(256+n); o++) {
			i = (i + 1) % 256;
			j = (j + S[i]) % 256;
			var Si = S[i];
			S[i] = S[j];
			S[j] = Si;
			if (o >= 256) {
				K.push((S[(S[i] + S[j]) % 256]).toString(16));
			}
		}
		return K;
	}
	
	ARC4.encrypt = function(key, msg) {
		var c = "";
		var ksm = PRGA(KSA(key), msg.length);
		for (var i=0; i!=msg.length; i++) {
			var x = (msg[i].charCodeAt(0) ^ parseInt(ksm[i], 16)).toString(16);
			if (x.length == 1) {
				x = "0" + x;
			}
			c += x;
		}
		return c;
	}
	
	ARC4.decrypt = function(key, msg) {
		var hex = "0123456789abcdef";
		for (var i=0; i!=msg.length; i++) {
			if ((hex.indexOf(msg[i].toLowerCase()) < 0) || (msg.length % 2)) {
				throw "ARC4: Invalid message";
			}
		}
		var c = "";
		var m = new Array();
		var ksm = PRGA(KSA(key), msg.length);
		for (var i=0; i!=msg.length; i+=2) {
			m.push(msg.substring(i, i+2));
		}
		for (var i=0; i!=m.length; i++) {
			var x = (parseInt(m[i], 16) ^ parseInt(ksm[i], 16));
			c += String.fromCharCode(x);
		}
		return c;
	}
	
})();