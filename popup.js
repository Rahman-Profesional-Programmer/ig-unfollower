const translations = {
  id: {
    title: 'Auto Unfollow IG by Indah Amuntai',
    dailyNotice: 'Gunakan target 200 unfollow per hari untuk menjaga keamanan akun.',
    safetyCaveat: 'Batas Instagram dapat berubah; jeda tidak menjamin akun aman.',
    targetLabel: 'Target total unfollow',
    usersUnit: 'akun',
    intervalTitle: 'Jeda antar permintaan',
    intervalLabel: 'Rentang jeda (detik)',
    minLabel: 'Minimum',
    maxLabel: 'Maksimum',
    minutesUnit: 'menit',
    forEveryLabel: 'Setiap',
    usersUnfollowedLabel: 'akun berhasil di-unfollow',
    cooldownDurationLabel: 'istirahat selama',
    cooldownEveryAria: 'Jumlah unfollow sebelum istirahat',
    cooldownDurationAria: 'Durasi istirahat dalam menit',
    failurePrefix: 'Jika permintaan gagal, jeda selama',
    failureSuffix: 'sebelum mencoba lagi',
    nextActionLabel: 'Aksi berikutnya dalam',
    runtimeLabel: 'Aplikasi berjalan selama',
    statusReady: 'Status: Siap',
    statusOpenInstagram: 'Status: Buka halaman Instagram untuk memulai.',
    statusRunning: 'Status: Berjalan ({count}/{target})',
    statusSearching: 'Status: Mencari tombol ({count}/{target})',
    statusCooldown: 'Status: Istirahat ({count}/{target})',
    statusRetrying: 'Status: Gagal; menunggu sebelum mencoba lagi ({count}/{target})',
    statusStopped: 'Status: Dihentikan ({count}/{target})',
    statusCompleted: 'Status: Selesai ({count}/{target})',
    statusError: 'Status: Error — {error}',
    startButton: 'Mulai',
    stopButton: 'Stop',
    errorInvalid: 'Pastikan semua nilai berupa bilangan bulat positif, jeda maksimum minimal sama dengan jeda minimum, dan durasi tidak melebihi batas timer.',
    errorInstagram: 'Buka halaman Instagram terlebih dahulu.',
    errorTab: 'Tab aktif tidak tersedia. Coba buka kembali popup.',
    errorAlreadyRunning: 'Proses sudah berjalan di tab ini.',
    errorStart: 'Tidak dapat memulai proses',
    errorStop: 'Tidak dapat menghentikan proses',
    errorStatus: 'Tidak dapat membaca status proses'
  },
  en: {
    title: 'Auto Unfollow IG by Indah Amuntai',
    dailyNotice: 'Use a target of 200 unfollows per day to help keep your account safe.',
    safetyCaveat: 'Instagram limits may change; delays cannot guarantee account safety.',
    targetLabel: 'Total unfollow target',
    usersUnit: 'users',
    intervalTitle: 'Interval between requests',
    intervalLabel: 'Delay range (seconds)',
    minLabel: 'Minimum',
    maxLabel: 'Maximum',
    minutesUnit: 'minutes',
    forEveryLabel: 'For every',
    usersUnfollowedLabel: 'users successfully unfollowed',
    cooldownDurationLabel: 'take a cooldown of',
    cooldownEveryAria: 'Number of successful unfollows before cooldown',
    cooldownDurationAria: 'Cooldown duration in minutes',
    failurePrefix: 'If a request fails, pause for',
    failureSuffix: 'before retrying',
    nextActionLabel: 'Next action in',
    runtimeLabel: 'App running for',
    statusReady: 'Status: Ready',
    statusOpenInstagram: 'Status: Open Instagram to get started.',
    statusRunning: 'Status: Running ({count}/{target})',
    statusSearching: 'Status: Looking for buttons ({count}/{target})',
    statusCooldown: 'Status: Cooling down ({count}/{target})',
    statusRetrying: 'Status: Failed; waiting before retry ({count}/{target})',
    statusStopped: 'Status: Stopped ({count}/{target})',
    statusCompleted: 'Status: Complete ({count}/{target})',
    statusError: 'Status: Error — {error}',
    startButton: 'Start',
    stopButton: 'Stop',
    errorInvalid: 'Enter positive whole numbers, ensure the maximum delay is at least the minimum, and keep durations within the timer limit.',
    errorInstagram: 'Open Instagram before starting.',
    errorTab: 'The active tab is unavailable. Reopen the popup and try again.',
    errorAlreadyRunning: 'A process is already running in this tab.',
    errorStart: 'Unable to start the process',
    errorStop: 'Unable to stop the process',
    errorStatus: 'Unable to read process status'
  }
};

const elements = {
  target: document.getElementById('targetUnfollow'),
  minDelay: document.getElementById('minDelay'),
  maxDelay: document.getElementById('maxDelay'),
  cooldownEvery: document.getElementById('cooldownEvery'),
  cooldownMinutes: document.getElementById('cooldownMinutes'),
  failurePause: document.getElementById('failurePause'),
  nextAction: document.getElementById('nextAction'),
  runtime: document.getElementById('runtime'),
  status: document.getElementById('status'),
  start: document.getElementById('startBtn'),
  stop: document.getElementById('stopBtn')
};

let language = localStorage.getItem('igUnfollowLanguage') === 'en' ? 'en' : 'id';
let activeTabId = null;
let refreshInProgress = false;

function message(key, values = {}) {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replace(`{${name}}`, String(value)),
    translations[language][key]
  );
}

function setLanguage(nextLanguage) {
  language = nextLanguage;
  localStorage.setItem('igUnfollowLanguage', language);
  document.documentElement.lang = language;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = translations[language][key];
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    const key = element.dataset.i18nAria;
    element.setAttribute('aria-label', translations[language][key]);
  });

  document.getElementById('langId').classList.toggle('active', language === 'id');
  document.getElementById('langEn').classList.toggle('active', language === 'en');
  document.getElementById('langId').setAttribute('aria-pressed', String(language === 'id'));
  document.getElementById('langEn').setAttribute('aria-pressed', String(language === 'en'));
  renderStatus(lastState);
}

let lastState = null;

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

function setControlsRunning(running) {
  [
    elements.target,
    elements.minDelay,
    elements.maxDelay,
    elements.cooldownEvery,
    elements.cooldownMinutes,
    elements.failurePause
  ].forEach((input) => {
    input.disabled = running;
  });
  elements.start.disabled = running;
  elements.stop.disabled = !running;
}

function renderStatus(state) {
  lastState = state;
  if (!state) {
    elements.nextAction.textContent = '--:--:--';
    elements.runtime.textContent = '00:00:00';
    elements.status.textContent = message('statusReady');
    setControlsRunning(false);
    return;
  }

  const now = Date.now();
  const elapsedUntil = state.endedAt || now;
  elements.runtime.textContent = formatDuration(elapsedUntil - state.startedAt);
  elements.nextAction.textContent = state.active && state.nextActionAt
    ? formatDuration(state.nextActionAt - now)
    : '--:--:--';

  const progress = { count: state.count, target: state.target };
  const statusKey = {
    running: 'statusRunning',
    searching: 'statusSearching',
    cooldown: 'statusCooldown',
    retrying: 'statusRetrying',
    stopped: 'statusStopped',
    completed: 'statusCompleted',
    error: 'statusError'
  }[state.status] || 'statusReady';
  const statusValues = state.status === 'error'
    ? { error: state.error || message('errorStatus') }
    : progress;

  elements.status.textContent = message(statusKey, statusValues);
  setControlsRunning(Boolean(state.active));
}

function parseInteger(input) {
  const value = Number(input.value);
  return Number.isSafeInteger(value) ? value : NaN;
}

function readOptions() {
  const options = {
    target: parseInteger(elements.target),
    minDelaySeconds: parseInteger(elements.minDelay),
    maxDelaySeconds: parseInteger(elements.maxDelay),
    cooldownEvery: parseInteger(elements.cooldownEvery),
    cooldownMinutes: parseInteger(elements.cooldownMinutes),
    failurePauseMinutes: parseInteger(elements.failurePause)
  };

  const valid = options.target >= 1
    && options.minDelaySeconds >= 1
    && options.maxDelaySeconds >= options.minDelaySeconds
    && options.maxDelaySeconds <= 2147483
    && options.cooldownEvery >= 1
    && options.cooldownMinutes >= 1
    && options.cooldownMinutes <= 35791
    && options.failurePauseMinutes >= 1
    && options.failurePauseMinutes <= 35791;

  return valid ? options : null;
}

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || typeof tab.id !== 'number') {
    throw new Error(message('errorTab'));
  }
  return tab;
}

function startAutoUnfollow(options) {
  if (window.isUnfollowingActive || (window.__igUnfollowState && window.__igUnfollowState.active)) {
    return { ok: false, reason: 'already_running' };
  }

  const state = {
    active: true,
    status: 'running',
    count: 0,
    failures: 0,
    target: options.target,
    startedAt: Date.now(),
    endedAt: null,
    nextActionAt: null,
    error: null,
    cancelDelay: null
  };
  window.__igUnfollowState = state;
  window.isUnfollowingActive = true;

  const wait = (milliseconds) => new Promise((resolve) => {
    state.nextActionAt = Date.now() + milliseconds;
    const timeoutId = setTimeout(() => {
      state.nextActionAt = null;
      state.cancelDelay = null;
      resolve();
    }, milliseconds);
    state.cancelDelay = () => {
      clearTimeout(timeoutId);
      state.nextActionAt = null;
      state.cancelDelay = null;
      resolve();
    };
  });

  const pauseAfterFailure = async (error) => {
    state.failures += 1;
    state.error = error ? String(error.message || error) : null;
    state.status = 'retrying';
    if (error) {
      console.error('Unfollow request failed:', error);
    }
    await wait(options.failurePauseMinutes * 60 * 1000);
  };

  (async () => {
    try {
      while (state.active && state.count < options.target) {
        const followingButtons = Array.from(document.querySelectorAll('button')).filter((button) => {
          const label = button.innerText.trim();
          return label === 'Following' || label === 'Mengikuti';
        });

        if (followingButtons.length === 0) {
          state.status = 'searching';
          const scrollableContainer = document.querySelector('div.x9f619.x1n2onr6.x1ja2u2z');
          if (scrollableContainer) {
            scrollableContainer.scrollBy(0, 300);
          } else {
            window.scrollBy(0, 300);
          }
          await wait(3000);
          continue;
        }

        try {
          state.status = 'running';
          const targetButton = followingButtons[0];
          targetButton.click();
          await wait(1500);
          if (!state.active) {
            break;
          }

          const confirmationButtons = Array.from(document.querySelectorAll('button')).filter((button) => {
            const label = button.innerText.trim();
            return label === 'Unfollow' || label === 'Berhenti Mengikuti';
          });

          if (confirmationButtons.length === 0) {
            await pauseAfterFailure();
            continue;
          }

          confirmationButtons[0].click();
          await wait(1500);
          if (!state.active) {
            break;
          }

          const updatedLabel = targetButton.isConnected ? targetButton.innerText.trim() : '';
          if (targetButton.isConnected && updatedLabel !== 'Follow' && updatedLabel !== 'Ikuti') {
            await pauseAfterFailure(new Error('Unfollow was not confirmed by the page.'));
            continue;
          }

          state.count += 1;
          state.error = null;

          if (state.count >= options.target) {
            break;
          }

          if (state.count % options.cooldownEvery === 0) {
            state.status = 'cooldown';
            await wait(options.cooldownMinutes * 60 * 1000);
          } else {
            const delaySeconds = options.minDelaySeconds
              + Math.floor(Math.random() * (options.maxDelaySeconds - options.minDelaySeconds + 1));
            await wait(delaySeconds * 1000);
          }
        } catch (error) {
          if (state.active) {
            await pauseAfterFailure(error);
          }
        }
      }

      if (state.status !== 'stopped') {
        state.status = state.count >= options.target ? 'completed' : 'stopped';
      }
    } catch (error) {
      state.status = 'error';
      state.error = String(error.message || error);
      console.error('Auto unfollow stopped because of an error:', error);
    } finally {
      state.active = false;
      window.isUnfollowingActive = false;
      state.nextActionAt = null;
      state.cancelDelay = null;
      if (!state.endedAt) {
        state.endedAt = Date.now();
      }
    }
  })();

  return { ok: true };
}

function stopAutoUnfollow() {
  const state = window.__igUnfollowState;
  if (!state || !state.active) {
    return { ok: false };
  }

  state.active = false;
  state.status = 'stopped';
  window.isUnfollowingActive = false;
  if (state.cancelDelay) {
    state.cancelDelay();
  }
  return { ok: true };
}

function getAutoUnfollowStatus() {
  const state = window.__igUnfollowState;
  if (!state) {
    return null;
  }

  return {
    active: state.active,
    status: state.status,
    count: state.count,
    target: state.target,
    failures: state.failures,
    startedAt: state.startedAt,
    endedAt: state.endedAt,
    nextActionAt: state.nextActionAt,
    error: state.error
  };
}

async function start() {
  const options = readOptions();
  if (!options) {
    elements.status.textContent = message('errorInvalid');
    return;
  }

  try {
    const tab = await getCurrentTab();
    if (!tab.url || !tab.url.includes('instagram.com')) {
      elements.status.textContent = message('errorInstagram');
      return;
    }

    activeTabId = tab.id;
    const results = await chrome.scripting.executeScript({
      target: { tabId: activeTabId },
      func: startAutoUnfollow,
      args: [options]
    });
    const result = results[0] && results[0].result;

    if (!result || !result.ok) {
      elements.status.textContent = result && result.reason === 'already_running'
        ? message('errorAlreadyRunning')
        : message('errorStart');
      await refreshStatus();
      return;
    }

    await refreshStatus();
  } catch (error) {
    elements.status.textContent = `${message('errorStart')}: ${error.message || error}`;
  }
}

async function stop() {
  if (activeTabId === null) {
    elements.status.textContent = message('errorTab');
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: activeTabId },
      func: stopAutoUnfollow
    });
    await refreshStatus();
  } catch (error) {
    elements.status.textContent = `${message('errorStop')}: ${error.message || error}`;
  }
}

async function refreshStatus() {
  if (refreshInProgress) {
    return;
  }
  refreshInProgress = true;

  try {
    const tab = await getCurrentTab();
    if (!tab.url || !tab.url.includes('instagram.com')) {
      activeTabId = null;
      renderStatus(null);
      elements.status.textContent = message('statusOpenInstagram');
      return;
    }

    activeTabId = tab.id;
    const results = await chrome.scripting.executeScript({
      target: { tabId: activeTabId },
      func: getAutoUnfollowStatus
    });
    renderStatus(results[0] ? results[0].result : null);
  } catch (error) {
    elements.status.textContent = `${message('errorStatus')}: ${error.message || error}`;
  } finally {
    refreshInProgress = false;
  }
}

document.getElementById('langId').addEventListener('click', () => setLanguage('id'));
document.getElementById('langEn').addEventListener('click', () => setLanguage('en'));
elements.start.addEventListener('click', start);
elements.stop.addEventListener('click', stop);

setLanguage(language);
refreshStatus();
setInterval(refreshStatus, 1000);
