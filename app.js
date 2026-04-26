function formatBallNumber(num) {
    return String(num).padStart(2, '0');
}

function createBall(num, colorClass) {
    const ball = document.createElement('div');
    ball.className = `ball ${colorClass}`;
    ball.textContent = formatBallNumber(num);
    ball.style.opacity = 0;
    return ball;
}

function createSeparator() {
    const separator = document.createElement('div');
    separator.className = 'separator';
    separator.setAttribute('aria-hidden', 'true');
    separator.style.opacity = 0;
    return separator;
}

function updateStatus(id, text) {
    document.getElementById(id).textContent = text;
}

function flashEffect(id) {
    const el = document.getElementById(id);
    gsap.fromTo(el, { opacity: 0.95 }, { opacity: 0, duration: 0.55, ease: "power2.out" });
}

function animateBallDrop(container) {
    gsap.fromTo(
        container.children,
        {
            y: -160,
            opacity: 0,
            scale: 0.5,
            rotation: 300
        },
        {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.82,
            stagger: 0.12,
            ease: "bounce.out"
        }
    );
}

function setLoadingState(buttonId, loaderId, statusId, loadingText, isLoading) {
    const button = document.getElementById(buttonId);
    const loader = document.getElementById(loaderId);

    button.disabled = isLoading;
    loader.style.display = isLoading ? 'block' : 'none';

    if (isLoading) {
        updateStatus(statusId, loadingText);
    }
}

async function loadSSQ() {
    const container = document.getElementById('ssq-balls');

    setLoadingState('btn-ssq', 'ssq-loader', 'ssq-status', '号码生成中...', true);
    container.innerHTML = '';
    flashEffect('ssq-flash');

    try {
        const res = await fetch("https://api.996.ninja/random/generate/ssq");
        const json = await res.json();
        const data = json.data;

        const balls = [
            ...data.redBalls.map((num) => createBall(num, 'red')),
            createSeparator(),
            createBall(data.blueBall, 'blue')
        ];

        balls.forEach((ball) => container.appendChild(ball));
        updateStatus('ssq-status', '已生成');
        animateBallDrop(container);
    } catch {
        updateStatus('ssq-status', '获取失败，请稍后重试');
        alert("获取双色球失败！");
    } finally {
        setLoadingState('btn-ssq', 'ssq-loader', 'ssq-status', '', false);
    }
}

async function loadDLT() {
    const container = document.getElementById('dlt-balls');

    setLoadingState('btn-dlt', 'dlt-loader', 'dlt-status', '号码生成中...', true);
    container.innerHTML = '';
    flashEffect('dlt-flash');

    try {
        const res = await fetch("https://api.996.ninja/random/generate/dlt");
        const json = await res.json();
        const data = json.data;

        const balls = [
            ...data.frontArea.map((num) => createBall(num, 'orange')),
            createSeparator(),
            ...data.backArea.map((num) => createBall(num, 'purple'))
        ];

        balls.forEach((ball) => container.appendChild(ball));
        updateStatus('dlt-status', '已生成');
        animateBallDrop(container);
    } catch {
        updateStatus('dlt-status', '获取失败，请稍后重试');
        alert("获取大乐透失败！");
    } finally {
        setLoadingState('btn-dlt', 'dlt-loader', 'dlt-status', '', false);
    }
}
