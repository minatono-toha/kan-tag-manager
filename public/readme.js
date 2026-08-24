/* 艦隊札管理帖 使い方ページ
   本体とは別ドキュメントなので Vue を読み込まず、素の DOM 操作だけで完結させる。
   CSP を script-src 'self' のままにしたいので、インラインではなくこのファイルに置く。 */
;(function () {
  'use strict'

  var THEMES = ['light', 'dark', 'gradient']

  /* テーマは本体と同じ localStorage キーを読むだけで引き継げる(同一オリジンのため)。
     <head> で同期実行して描画前にクラスを付け、ライト→ダークのちらつきを防ぐ。 */
  function applyTheme() {
    var theme = null
    try {
      theme = localStorage.getItem('app-theme')
    } catch (e) {
      /* プライベートモード等で参照できない場合は既定値にフォールバックする */
    }
    if (THEMES.indexOf(theme) === -1) {
      theme =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
    }
    document.documentElement.classList.add('theme-' + theme)
  }

  function initTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'))
    if (!tabs.length) return

    var ids = tabs.map(function (tab) {
      return tab.getAttribute('aria-controls')
    })

    function show(id, moveFocus) {
      if (ids.indexOf(id) === -1) id = ids[0]
      tabs.forEach(function (tab) {
        var target = tab.getAttribute('aria-controls')
        var selected = target === id
        tab.setAttribute('aria-selected', selected ? 'true' : 'false')
        // 選択中のタブだけを Tab キーの停止位置にする(タブ内は矢印キーで移動)
        tab.tabIndex = selected ? 0 : -1
        var panel = document.getElementById(target)
        if (panel) panel.hidden = !selected
        if (selected && moveFocus) tab.focus()
      })
    }

    function activate(id, moveFocus) {
      // location.hash を直接書くとパネル先頭までスクロールしてしまうので pushState を使う。
      // pushState なら履歴が積まれるため、戻るボタンで前のタブへ戻れる。
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', '#' + id)
      }
      show(id, moveFocus)
      window.scrollTo(0, 0)
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        activate(tab.getAttribute('aria-controls'), false)
      })

      tab.addEventListener('keydown', function (event) {
        var next = null
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
        else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
        else if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = tabs.length - 1
        if (next === null) return
        event.preventDefault()
        activate(ids[next], true)
      })
    })

    /* 本文中からタブへ飛ぶリンク(「→ ①着任状況を反映する タブ」など)。
       素の hash 遷移に任せるとパネル先頭までスクロールしてしまうので、
       タブのクリックと同じ経路に寄せる。飛び先のタブへフォーカスも移し、
       どのタブに移動したのかが分かるようにする。 */
    document.querySelectorAll('a.tab-link').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var id = (link.getAttribute('href') || '').replace(/^#/, '')
        if (ids.indexOf(id) === -1) return
        event.preventDefault()
        activate(id, true)
      })
    })

    function currentHash() {
      return decodeURIComponent(window.location.hash.replace(/^#/, ''))
    }

    // 戻る/進む、および外部からの #ハッシュ付きリンクに追従する
    window.addEventListener('popstate', function () {
      show(currentHash(), false)
    })
    window.addEventListener('hashchange', function () {
      show(currentHash(), false)
    })

    show(currentHash(), false)
  }

  applyTheme()

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTabs)
  } else {
    initTabs()
  }
})()
