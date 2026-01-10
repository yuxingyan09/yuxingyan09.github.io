/**
 * 从指定 URL 获取 txt 文件内容
 * @param {string} url - txt 文件的完整地址
 * @returns {Promise<string>} - 包含文件文本的 Promise
 */
async function fetchTxt(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`网络错误：${response.status} ${response.statusText}`);
        }
        const text = await response.text();   // 读取为纯文本
        return text;
    } catch (err) {
        console.error('获取 txt 文件失败：', err);
        throw err; // 让调用方自行处理错误
    }
}

async function createStickyNotesFromText(url) {
    try {
        // 获取文本内容
        const text = await fetchTxt(url);

        // 获取容器元素
        const container = document.getElementById('sticky-notes');
        if (!container) {
            throw new Error('未找到 id 为 "sticky-notes" 的元素');
        }

        // 清空容器（如果需要保留原有内容，可以移除这行）
        container.innerHTML = '';

        // 按换行分割文本，并过滤空行
        const lines = text.split('\n').filter(line => line.trim() !== '');

        // 为每一行创建一个便签元素
        lines.forEach(line => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.textContent = line.trim(); // 去除首尾空白
            container.appendChild(noteElement);
        });

        addRandomRotationToNotes()

        return lines.length; // 返回创建的便签数量
    } catch (error) {
        console.error('创建便签失败：', error);
        throw error;
    }
}

function addRandomRotationToNotes() {
    const container = document.getElementById('sticky-notes');
    if (!container) {
        console.error('未找到 id 为 "sticky-notes" 的元素');
        return;
    }

    const notes = container.querySelectorAll('.note');

    notes.forEach(note => {
        // 生成 -4 到 4 之间的随机角度
        const randomDeg = (Math.random() * 8) - 4; // 8是范围，-4是偏移
        const currentTransform = note.style.transform || '';

        // 保留已有的 transform 属性，追加旋转
        note.style.transform = `${currentTransform} rotate(${randomDeg}deg)`.trim();
    });

    console.log(`为 ${notes.length} 个 note 元素添加了随机旋转`);
    return notes.length;
}

createStickyNotesFromText('./notes.txt')