/* ========================================
   Velocity Demo — Interactions
   ======================================== */

(function () {
    'use strict';

    var caLink = document.getElementById('caLink');
    var tradingPanel = document.getElementById('tradingPanel');
    var chartPanel = document.getElementById('chartPanel');
    var contextOverlay = document.getElementById('contextOverlay');
    var ctxCopy = document.getElementById('ctxCopy');

    // Find the parent message bubble of the CA link
    var caMessage = caLink.closest('.tg-msg');

    // ────────────────────────────────────────
    // CA Click → Show Context Menu
    // ────────────────────────────────────────

    var clickCount = 0;
    var clickTimer = null;
    var DOUBLE_CLICK_DELAY = 350;

    caLink.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        clickCount++;

        if (clickCount === 1) {
            clickTimer = setTimeout(function () {
                clickCount = 0;
                showContextMenu();
            }, DOUBLE_CLICK_DELAY);
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;
            showContextMenuForChart();
        }
    });

    caLink.addEventListener('dblclick', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    // ────────────────────────────────────────
    // Context Menu Flow
    // ────────────────────────────────────────

    function showContextMenu() {
        // Highlight the CA message
        if (caMessage) caMessage.classList.add('msg-selected');

        // Show the overlay
        contextOverlay.classList.add('visible');

        // After a beat, auto-highlight "Copy"
        setTimeout(function () {
            ctxCopy.classList.add('highlighted');
        }, 400);

        // After another beat, simulate the "copy" tap
        setTimeout(function () {
            ctxCopy.style.transform = 'scale(0.96)';
            setTimeout(function () {
                ctxCopy.style.transform = '';
            }, 100);
        }, 900);

        // Show "Copied!" toast and dismiss menu
        setTimeout(function () {
            showCopiedToast();
            dismissContextMenu();
        }, 1100);

        // After toast, open the trading panel
        setTimeout(function () {
            openPanel('trading');
        }, 1800);
    }

    function showContextMenuForChart() {
        if (caMessage) caMessage.classList.add('msg-selected');
        contextOverlay.classList.add('visible');

        setTimeout(function () {
            ctxCopy.classList.add('highlighted');
        }, 300);

        setTimeout(function () {
            ctxCopy.style.transform = 'scale(0.96)';
            setTimeout(function () {
                ctxCopy.style.transform = '';
            }, 100);
        }, 700);

        setTimeout(function () {
            showCopiedToast();
            dismissContextMenu();
        }, 900);

        setTimeout(function () {
            openPanel('chart');
        }, 1500);
    }

    function dismissContextMenu() {
        contextOverlay.classList.remove('visible');
        ctxCopy.classList.remove('highlighted');
        if (caMessage) caMessage.classList.remove('msg-selected');
    }

    function showCopiedToast() {
        // Create a toast element
        var toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = '✓ Copied to clipboard';
        document.querySelector('.phone-frame').appendChild(toast);

        // Trigger animation
        requestAnimationFrame(function () {
            toast.classList.add('show');
        });

        // Remove after a moment
        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () {
                toast.remove();
            }, 300);
        }, 800);
    }

    // Dismiss on overlay click (outside the menu)
    contextOverlay.addEventListener('click', function (e) {
        if (e.target === contextOverlay) {
            dismissContextMenu();
        }
    });

    // ────────────────────────────────────────
    // Panel Management
    // ────────────────────────────────────────

    function openPanel(type) {
        tradingPanel.classList.remove('active');
        chartPanel.classList.remove('active');

        if (type === 'trading') {
            tradingPanel.classList.add('active');
        } else if (type === 'chart') {
            chartPanel.classList.add('active');
            setTimeout(drawCandlestickChart, 80);
        }

        var messages = document.querySelector('.tg-messages');
        messages.scrollTop = messages.scrollHeight;
    }

    window.closePanel = function () {
        tradingPanel.classList.remove('active');
        chartPanel.classList.remove('active');
    };

    // ────────────────────────────────────────
    // View Chart / Limit Orders Buttons
    // ────────────────────────────────────────

    document.getElementById('viewChartBtn').addEventListener('click', function () {
        openPanel('chart');
    });

    // ────────────────────────────────────────
    // Preset Button Toggling
    // ────────────────────────────────────────

    document.querySelectorAll('.buy-presets .preset-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.buy-presets .preset-btn').forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');

            // Simulate opening a position
            var solAmount = parseFloat(btn.textContent);
            var tokenPrice = 0.00234889;
            var tokensReceived = Math.floor(solAmount / tokenPrice);
            var pnlPercent = (Math.random() * 40 - 5).toFixed(1); // -5% to +35%
            var pnlValue = (solAmount * (pnlPercent / 100)).toFixed(3);
            var isPositive = parseFloat(pnlPercent) >= 0;

            var posBought = document.getElementById('posBought');
            var posSold = document.getElementById('posSold');
            var posRemaining = document.getElementById('posRemaining');
            var posPnl = document.getElementById('posPnl');

            posBought.textContent = solAmount + ' SOL';
            posBought.className = 'pos-value';

            posSold.textContent = '0 SOL';
            posSold.className = 'pos-value';

            posRemaining.textContent = tokensReceived.toLocaleString() + ' TROLL';
            posRemaining.className = 'pos-value';

            posPnl.textContent = (isPositive ? '+' : '') + pnlPercent + '%';
            posPnl.className = 'pos-value ' + (isPositive ? 'positive' : 'negative');
        });
    });

    document.querySelectorAll('.sell-presets .preset-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.sell-presets .preset-btn').forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
        });
    });

    // ────────────────────────────────────────
    // Timeframe Button Switching
    // ────────────────────────────────────────

    document.querySelectorAll('.tf-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.tf-btn').forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            drawCandlestickChart();
        });
    });

    // ────────────────────────────────────────
    // Keyboard Key Press Effect
    // ────────────────────────────────────────

    document.querySelectorAll('.akb-key').forEach(function (key) {
        key.addEventListener('mousedown', function () {
            key.style.background = '#555';
            key.style.transform = 'scale(0.95)';
        });
        key.addEventListener('mouseup', function () {
            key.style.background = '';
            key.style.transform = '';
        });
        key.addEventListener('mouseleave', function () {
            key.style.background = '';
            key.style.transform = '';
        });
    });

    // ────────────────────────────────────────
    // Candlestick Chart Drawing
    // ────────────────────────────────────────

    function drawCandlestickChart() {
        var canvas = document.getElementById('trollChart');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;

        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        var w = rect.width;
        var h = rect.height;

        ctx.clearRect(0, 0, w, h);

        var candles = generateCandleData(30);

        var allLows = candles.map(function (c) { return c.low; });
        var allHighs = candles.map(function (c) { return c.high; });
        var minPrice = Math.min.apply(null, allLows);
        var maxPrice = Math.max.apply(null, allHighs);
        var priceRange = maxPrice - minPrice || 1;

        var padding = { top: 8, bottom: 8, left: 4, right: 4 };
        var chartW = w - padding.left - padding.right;
        var chartH = h - padding.top - padding.bottom;

        var gap = chartW / candles.length;
        var candleWidth = gap * 0.65;

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 0.5;
        for (var g = 0; g < 4; g++) {
            var gy = padding.top + (chartH / 4) * g;
            ctx.beginPath();
            ctx.moveTo(padding.left, gy);
            ctx.lineTo(w - padding.right, gy);
            ctx.stroke();
        }

        // Draw candles
        for (var i = 0; i < candles.length; i++) {
            var c = candles[i];
            var x = padding.left + gap * i + gap / 2;

            var bullish = c.close >= c.open;
            var bodyColor = bullish ? '#22c55e' : '#ef4444';
            var wickColor = bullish ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)';

            var yHigh = padding.top + chartH - ((c.high - minPrice) / priceRange) * chartH;
            var yLow = padding.top + chartH - ((c.low - minPrice) / priceRange) * chartH;
            var yOpen = padding.top + chartH - ((c.open - minPrice) / priceRange) * chartH;
            var yClose = padding.top + chartH - ((c.close - minPrice) / priceRange) * chartH;

            // Wick
            ctx.beginPath();
            ctx.strokeStyle = wickColor;
            ctx.lineWidth = 1;
            ctx.moveTo(x, yHigh);
            ctx.lineTo(x, yLow);
            ctx.stroke();

            // Body
            var bodyTop = Math.min(yOpen, yClose);
            var bodyHeight = Math.max(Math.abs(yOpen - yClose), 1.5);
            ctx.fillStyle = bodyColor;
            ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        }

        // Current price dashed line
        var lastCandle = candles[candles.length - 1];
        var currentY = padding.top + chartH - ((lastCandle.close - minPrice) / priceRange) * chartH;
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, currentY);
        ctx.lineTo(w - padding.right, currentY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#4ade80';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('$' + lastCandle.close.toFixed(6), w - 6, currentY - 4);
    }

    function generateCandleData(count) {
        var candles = [];
        var price = 0.002 + Math.random() * 0.001;

        for (var i = 0; i < count; i++) {
            var volatility = price * (0.02 + Math.random() * 0.08);
            var trend = (Math.random() - 0.42) * volatility;

            var open = price;
            var close = open + trend;
            close = Math.max(close, 0.0001);

            var high = Math.max(open, close) + Math.random() * volatility * 0.5;
            var low = Math.min(open, close) - Math.random() * volatility * 0.5;
            low = Math.max(low, 0.00001);

            candles.push({ open: open, high: high, low: low, close: close });
            price = close;
        }

        return candles;
    }

    // ────────────────────────────────────────
    // Buy/Sell Button Feedback
    // ────────────────────────────────────────

    document.querySelectorAll('.chart-buy-btn, .chart-sell-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var originalText = btn.textContent;
            btn.textContent = '✓ Confirmed';
            btn.style.opacity = '0.7';
            setTimeout(function () {
                btn.textContent = originalText;
                btn.style.opacity = '1';
            }, 1200);
        });
    });

    // ────────────────────────────────────────
    // Auto-scroll messages to bottom on load
    // ────────────────────────────────────────

    window.addEventListener('load', function () {
        var messages = document.querySelector('.tg-messages');
        messages.scrollTop = messages.scrollHeight;
    });

})();
