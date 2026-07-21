// jsdom に無いブラウザAPIをテスト全体で補う。
// 3つの表はヘッダの高さを ResizeObserver で実測しているため、
// これが無いとマウントしただけで落ちる。
// 既に個別のテストがスタブしている場合はそちらを優先する(??=)。
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver
