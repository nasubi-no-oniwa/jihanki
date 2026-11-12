// 携帯自販機：決まりごと・ことば・外れの演出100種類
export const PRICE = 150;      // 1本の値段（架空）
export const PWIN = 0.02;      // 当たる確率（50本に1本。景品表示法の上限と同じ）
export const NCOL = 7;
export const OPT = { dim: false };   // まぶしさをおさえる設定
export const COLORS = [
  { k: 'red', hex: '#ff3b30', lite: '#ff8a80', dark: '#5c0b07' },
  { k: 'orange', hex: '#ff9500', lite: '#ffc266', dark: '#5c3200' },
  { k: 'yellow', hex: '#ffd60a', lite: '#fff0a0', dark: '#5c4a00' },
  { k: 'green', hex: '#30c759', lite: '#9af0b0', dark: '#0b4a1e' },
  { k: 'blue', hex: '#1e90ff', lite: '#9fd0ff', dark: '#062c5c' },
  { k: 'indigo', hex: '#4a4ae8', lite: '#a8a8ff', dark: '#10104f' },
  { k: 'purple', hex: '#b455e8', lite: '#e0b0ff', dark: '#3a0b5c' }
];
export const LANGS = [['ja', '日本語'], ['en', 'English'], ['zh', '繁中'], ['ko', '한국어']];
export const TX = {
  ja: {
    title: '携帯自販機', sub: '当たり付き', how: 'ボタンを押して、4けたの数字がそろえば当たり。当たる確率は本物と同じ（50本に1本）。当たりは虹の7色、ぜんぶ集めろ。',
    start: '買いにいく', zukan: '図鑑・みんなの人数', hikitsugi: '引き継ぎコード', dim: 'まぶしさをおさえる', on: 'ON', off: 'OFF',
    tap: '好きな飲み物を押す', skip: 'タップで飛ばす', quit: 'タイトル',
    hud: '{b}本目', yen: '{y}円',
    lose: 'はずれ', win: '当たり！', winc: '{c}の当たり！', newc: '新しい色！', dupc: '{n}回目', comp: 'コンプリート！',
    c0: '赤', c1: '橙', c2: '黄', c3: '緑', c4: '青', c5: '藍', c6: '紫',
    e0: '大噴火', e1: '夏祭り', e2: '一攫千金', e3: '大豊作', e4: '大波', e5: '宇宙へ', e6: '降臨',
    stB: '通算', stBv: '{b}本目', stY: '使ったお金', stYv: '{y}円', stZ: '図鑑', stZv: '{k}/7',
    again: 'もう1本（150円）', vid: '動画にする', xpost: 'Xに投稿', top: 'タイトルへ', says: '自販機のひとこと',
    rec: '動画を作っています…', vmade: '動画ができました', vshare: '共有する（Xアプリへ）', vsave: '動画を保存する', vx: 'Xに投稿（文だけ）', vback: 'もどる', vfail: 'この端末では動画を作れませんでした', shareHint: '動画を保存してから、Xに投稿してね',
    zTitle: '図鑑', zPeople: '{n}人', zMine: '×{n}', zNone: 'まだ', zHid: '？？？', zComp: 'コンプした人', zNote: '当てた色を押すと、演出をもう一度見られるよ', zLoad: '読みこみ中…', zErr: '人数を読みこめませんでした', zMy: '通算 {b}本・{y}円・当たり {w}回', back: 'もどる',
    hTitle: '引き継ぎコード', hNote: '別のブラウザやスマホに記録を移せます。コードを作って、移したい先で入れてください。', hMake: 'コードを作る', hCode: 'あなたのコード', hIn: 'コードを入れる', hPh: '8文字', hLoad: '読みこむ', hOk: '記録を読みこみました', hNg: 'そのコードは見つかりませんでした', hErr: '通信できませんでした', hMade: 'このコードを、移したい先で入れてください',
    feed: 'だれかが{c}を当てました（{b}本目）', feedComp: 'だれかが7色コンプしました（{b}本目）',
    postL: '携帯自販機\n{b}本目、はずれ（{d}）\n使ったお金 {y}円・図鑑 {k}/7\n#携帯自販機',
    postW: '携帯自販機\n{b}本目で{c}の当たり！（{d}）\n使ったお金 {y}円・図鑑 {k}/7\n#携帯自販機',
    postC: '携帯自販機 コンプリート！\n{b}本・{y}円で、虹の7色をそろえた\n#携帯自販機',
    cert: 'コンプリート証明', certB: '{b}本', certY: '{y}円', certL: '虹の7色、ぜんぶ当てました',
    hot: 'アツい！', atari1: 'あた…', atari2: 'あた…らない', ogp: '当たる確率は、本物と同じ。', noname: 'だれか'
  },
  en: {
    title: 'POCKET VENDING', sub: 'with a prize draw', how: 'Press a button. If all 4 digits match, you win. The odds are the same as a real Japanese vending machine (1 in 50). Wins come in 7 rainbow colors. Collect them all.',
    start: 'Go buy a drink', zukan: 'Collection & player counts', hikitsugi: 'Transfer code', dim: 'Reduce flashing', on: 'ON', off: 'OFF',
    tap: 'Press any drink', skip: 'Tap to skip', quit: 'Title',
    hud: 'Can #{b}', yen: '¥{y}',
    lose: 'MISS', win: 'WINNER!', winc: '{c} WIN!', newc: 'New color!', dupc: 'x{n}', comp: 'COMPLETE!',
    c0: 'Red', c1: 'Orange', c2: 'Yellow', c3: 'Green', c4: 'Blue', c5: 'Indigo', c6: 'Purple',
    e0: 'ERUPTION', e1: 'FESTIVAL', e2: 'JACKPOT', e3: 'HARVEST', e4: 'BIG WAVE', e5: 'TO SPACE', e6: 'ADVENT',
    stB: 'Total', stBv: 'Can #{b}', stY: 'Spent', stYv: '¥{y}', stZ: 'Collection', stZv: '{k}/7',
    again: 'One more (¥150)', vid: 'Make a video', xpost: 'Post on X', top: 'Title', says: 'The machine says',
    rec: 'Making the video…', vmade: 'Video ready', vshare: 'Share (to the X app)', vsave: 'Save video', vx: 'Post on X (text only)', vback: 'Back', vfail: 'This device could not make the video', shareHint: 'Save the video, then post it on X',
    zTitle: 'Collection', zPeople: '{n}', zMine: 'x{n}', zNone: 'none', zHid: '???', zComp: 'Completed all 7', zNote: 'Tap a color you have won to watch it again', zLoad: 'Loading…', zErr: 'Could not load the counts', zMy: 'Total {b} cans · ¥{y} · {w} wins', back: 'Back',
    hTitle: 'Transfer code', hNote: 'Move your record to another browser or phone. Make a code here, then enter it there.', hMake: 'Make a code', hCode: 'Your code', hIn: 'Enter a code', hPh: '8 letters', hLoad: 'Load', hOk: 'Record loaded', hNg: 'That code was not found', hErr: 'Could not connect', hMade: 'Enter this code on the other device',
    feed: 'Someone just won {c} (can #{b})', feedComp: 'Someone completed all 7 colors (can #{b})',
    postL: 'POCKET VENDING\nCan #{b}: miss ({d})\nSpent ¥{y} · Collection {k}/7\n#携帯自販機',
    postW: 'POCKET VENDING\nCan #{b}: {c} WIN! ({d})\nSpent ¥{y} · Collection {k}/7\n#携帯自販機',
    postC: 'POCKET VENDING: COMPLETE!\nAll 7 rainbow colors in {b} cans (¥{y})\n#携帯自販機',
    cert: 'CERTIFICATE OF COMPLETION', certB: '{b} cans', certY: '¥{y}', certL: 'Won all 7 colors of the rainbow',
    hot: 'HOT!', atari1: 'WIN…', atari2: 'WIN…NOT', ogp: 'Same odds as the real thing.', noname: 'Someone'
  },
  zh: {
    title: '隨身販賣機', sub: '附抽獎', how: '按下按鈕，4個數字全部一樣就中獎。中獎機率和真的販賣機一樣（50罐中1罐）。獎有彩虹7色，全部收集起來。',
    start: '去買飲料', zukan: '圖鑑・大家的人數', hikitsugi: '引繼碼', dim: '減少閃光', on: 'ON', off: 'OFF',
    tap: '按喜歡的飲料', skip: '點一下跳過', quit: '標題',
    hud: '第{b}罐', yen: '{y}日圓',
    lose: '沒中', win: '中獎！', winc: '{c}色中獎！', newc: '新的顏色！', dupc: '第{n}次', comp: '全收集！',
    c0: '紅', c1: '橙', c2: '黃', c3: '綠', c4: '藍', c5: '靛', c6: '紫',
    e0: '大噴發', e1: '夏日祭', e2: '一夜致富', e3: '大豐收', e4: '大浪', e5: '飛向宇宙', e6: '降臨',
    stB: '累計', stBv: '第{b}罐', stY: '花掉的錢', stYv: '{y}日圓', stZ: '圖鑑', stZv: '{k}/7',
    again: '再來一罐（150日圓）', vid: '做成影片', xpost: '發到X', top: '回標題', says: '販賣機說',
    rec: '正在製作影片…', vmade: '影片做好了', vshare: '分享（到X App）', vsave: '儲存影片', vx: '發到X（只有文字）', vback: '返回', vfail: '這台裝置無法製作影片', shareHint: '先儲存影片，再發到X',
    zTitle: '圖鑑', zPeople: '{n}人', zMine: '×{n}', zNone: '還沒', zHid: '？？？', zComp: '全收集的人', zNote: '點中過的顏色，可以再看一次演出', zLoad: '讀取中…', zErr: '無法讀取人數', zMy: '累計 {b}罐・{y}日圓・中獎 {w}次', back: '返回',
    hTitle: '引繼碼', hNote: '可以把紀錄移到別的瀏覽器或手機。在這裡產生代碼，到另一邊輸入。', hMake: '產生代碼', hCode: '你的代碼', hIn: '輸入代碼', hPh: '8個字', hLoad: '讀取', hOk: '紀錄已讀取', hNg: '找不到這個代碼', hErr: '無法連線', hMade: '請在另一台裝置輸入這個代碼',
    feed: '有人中了{c}色（第{b}罐）', feedComp: '有人集滿7色了（第{b}罐）',
    postL: '隨身販賣機\n第{b}罐，沒中（{d}）\n花掉 {y}日圓・圖鑑 {k}/7\n#携帯自販機',
    postW: '隨身販賣機\n第{b}罐中了{c}色！（{d}）\n花掉 {y}日圓・圖鑑 {k}/7\n#携帯自販機',
    postC: '隨身販賣機 全收集！\n用{b}罐・{y}日圓集滿彩虹7色\n#携帯自販機',
    cert: '全收集證明', certB: '{b}罐', certY: '{y}日圓', certL: '彩虹7色，全部中了',
    hot: '超熱！', atari1: '中…', atari2: '中…不了', ogp: '中獎機率，和真的一樣。', noname: '某人'
  },
  ko: {
    title: '휴대 자판기', sub: '당첨 있음', how: '버튼을 누르고, 숫자 4개가 모두 같으면 당첨. 당첨 확률은 진짜 자판기와 같다 (50캔에 1캔). 당첨은 무지개 7색, 전부 모아라.',
    start: '사러 가기', zukan: '도감・모두의 인원', hikitsugi: '이어하기 코드', dim: '번쩍임 줄이기', on: 'ON', off: 'OFF',
    tap: '좋아하는 음료를 누르기', skip: '탭해서 넘기기', quit: '타이틀',
    hud: '{b}캔째', yen: '{y}엔',
    lose: '꽝', win: '당첨!', winc: '{c} 당첨!', newc: '새로운 색!', dupc: '{n}번째', comp: '컴플리트!',
    c0: '빨강', c1: '주황', c2: '노랑', c3: '초록', c4: '파랑', c5: '남색', c6: '보라',
    e0: '대분화', e1: '여름 축제', e2: '일확천금', e3: '대풍작', e4: '큰 파도', e5: '우주로', e6: '강림',
    stB: '통산', stBv: '{b}캔째', stY: '쓴 돈', stYv: '{y}엔', stZ: '도감', stZv: '{k}/7',
    again: '한 캔 더 (150엔)', vid: '영상 만들기', xpost: 'X에 올리기', top: '타이틀로', says: '자판기의 한마디',
    rec: '영상을 만드는 중…', vmade: '영상이 완성되었습니다', vshare: '공유하기 (X 앱으로)', vsave: '영상 저장', vx: 'X에 올리기 (글만)', vback: '돌아가기', vfail: '이 기기에서는 영상을 만들 수 없습니다', shareHint: '영상을 저장한 뒤 X에 올려 주세요',
    zTitle: '도감', zPeople: '{n}명', zMine: '×{n}', zNone: '아직', zHid: '？？？', zComp: '컴플리트한 사람', zNote: '당첨된 색을 누르면 연출을 다시 볼 수 있어요', zLoad: '불러오는 중…', zErr: '인원을 불러오지 못했습니다', zMy: '통산 {b}캔・{y}엔・당첨 {w}회', back: '돌아가기',
    hTitle: '이어하기 코드', hNote: '다른 브라우저나 폰으로 기록을 옮길 수 있습니다. 여기서 코드를 만들고, 옮길 곳에서 입력하세요.', hMake: '코드 만들기', hCode: '내 코드', hIn: '코드 입력', hPh: '8글자', hLoad: '불러오기', hOk: '기록을 불러왔습니다', hNg: '그 코드를 찾을 수 없습니다', hErr: '통신할 수 없습니다', hMade: '옮길 기기에서 이 코드를 입력하세요',
    feed: '누군가 {c}을(를) 뽑았습니다 ({b}캔째)', feedComp: '누군가 7색을 컴플리트했습니다 ({b}캔째)',
    postL: '휴대 자판기\n{b}캔째, 꽝 ({d})\n쓴 돈 {y}엔・도감 {k}/7\n#携帯自販機',
    postW: '휴대 자판기\n{b}캔째에 {c} 당첨! ({d})\n쓴 돈 {y}엔・도감 {k}/7\n#携帯自販機',
    postC: '휴대 자판기 컴플리트!\n{b}캔・{y}엔으로 무지개 7색을 모았다\n#携帯自販機',
    cert: '컴플리트 증명', certB: '{b}캔', certY: '{y}엔', certL: '무지개 7색, 전부 당첨',
    hot: '뜨겁다!', atari1: '당첨…', atari2: '당첨…아님', ogp: '당첨 확률은, 진짜와 같다.', noname: '누군가'
  }
};

// ===== 外れの演出 100種類 =====
// [動き, 数字の形, 日本語, 英語, 繁体字, 韓国語]
// 動き：0=ふつう 23=首をかしげる 24=ため息 1=リーチ+1 2=リーチ-1 3=すべり 4=逆回転 5=長い鼓動 21=3つ目で終わり
//       6=虹の予告 7=「アツい！」 8=ゆれる 9=金のオーラ 10=雷 11=カウントダウン 12=サイレン 13=紙吹雪フライング 14=「あた…」
//       15=缶の行進 16=ボタン全点灯 17=ズーム 18=暗転 19=UFO 20=猫 22=ファンファーレ中断 25=全部のせ
// 数字の形：r=バラバラ p2=前2つそろい x+=3つそろい+1 x-=3つそろい-1 z8/z9/z0=対象外のゾロ目 s+=のぼり s-=くだり mr=左右対称 ab=交互 l3=後ろ3つそろい d3=前2つそろい+3つ目が1ずれ g:NNNN=決まった数字
export const LOSE = [
  [0, 'r', 'はずれです。ふつうに。', 'Miss. Just a regular miss.', '沒中。就很普通地沒中。', '꽝입니다. 그냥 평범하게.'],
  [0, 'r', 'またのご利用をお待ちしています', 'Please come again', '歡迎再度光臨', '또 이용해 주세요'],
  [0, 'r', '150円、たしかにいただきました', '150 yen received. Thanks.', '150日圓，確實收到了', '150엔, 잘 받았습니다'],
  [23, 'r', '飲み物は出ました。それで十分では？', "You got a drink. Isn't that enough?", '飲料有掉出來。這樣還不夠嗎？', '음료는 나왔잖아요. 그걸로 충분하지 않나요?'],
  [0, 'r', 'まだ買う？', 'Buying another?', '還要買？', '또 살 거예요?'],
  [0, 'r', '当たりは、買った人にしか出ません', 'Only buyers can win', '只有買的人才會中', '당첨은 사는 사람에게만 나옵니다'],
  [24, 'r', 'のどは潤いましたか', 'Thirst quenched?', '解渴了嗎', '목은 축이셨나요'],
  [0, 'r', 'おつりは出ません。当たりも出ません', 'No change. No win either.', '不找零。也不會中', '거스름돈 없음. 당첨도 없음'],
  [23, 'r', 'さっきの人は当たってましたよ', 'The last person won, you know', '剛剛那個人有中喔', '아까 그 사람은 당첨됐어요'],
  [0, 'r', '次こそ、かもしれません', 'Maybe next time. Maybe.', '下次也許會中。也許。', '다음엔 될지도 몰라요'],
  [0, 'r', '確率は平等です。残酷なほどに', 'The odds are fair. Cruelly fair.', '機率很公平。公平得很殘酷', '확률은 평등합니다. 잔인할 만큼'],
  [23, 'r', '気のせいです。何も光ってません', 'You imagined it. Nothing lit up.', '是你的錯覺。什麼都沒亮', '기분 탓이에요. 아무것도 안 빛났어요'],
  [24, 'r', '財布、大丈夫ですか', 'Is your wallet okay?', '錢包還好嗎', '지갑은 괜찮으세요?'],
  [0, 'r', 'これは架空のお金です。安心して溶かしてください', "It's pretend money. Burn it freely.", '這是假的錢，請安心花光', '가짜 돈이에요. 안심하고 태우세요'],
  [23, 'r', '押すボタン、そこでよかったですか', 'Sure that was the right button?', '按那顆按鈕真的好嗎', '그 버튼이 맞았을까요?'],
  [0, 'r', '惜しくもなんともないです', 'Not even close', '一點都不可惜', '아깝지도 않네요'],
  [0, 'r', 'ただの飲み物です', 'Just a drink', '只是普通的飲料', '그냥 음료입니다'],
  [24, 'r', 'はずれ。でも冷えてます', "Miss. But it's cold.", '沒中。不過是冰的', '꽝. 하지만 시원해요'],
  [0, 'r', '自販機は裏切りません。当たらないだけです', "I never betray you. You just don't win.", '販賣機不會背叛你，只是不會中', '자판기는 배신 안 해요. 안 맞을 뿐'],
  [0, 'r', '継続は力なり、と言いますね', 'Persistence pays, they say', '俗話說堅持就是力量', '꾸준함이 힘이라죠'],
  [0, 'r', '当たるまで買えば、当たります', "Buy until you win and you'll win", '買到中為止就會中', '될 때까지 사면 됩니다'],
  [24, 'r', '今日はそういう日です', "It's just one of those days", '今天就是這種日子', '오늘은 그런 날이에요'],
  [0, 'r', 'ごちそうさまです', 'Thanks for the cash', '多謝款待', '잘 먹었습니다'],
  [23, 'r', '数字、バラバラでしたね', 'Those digits were all over the place', '數字很散呢', '숫자가 제각각이네요'],
  [0, 'r', 'もう1本いっときます？', 'One more?', '再來一罐？', '한 캔 더?'],
  [0, 'r', 'わたしは見ています。あなたの本数を', "I'm counting your cans", '我都看著呢，你買了幾罐', '지켜보고 있어요, 당신의 캔 수를'],
  [0, 'r', 'はずれ（平常運転）', 'Miss (business as usual)', '沒中（正常發揮）', '꽝 (평소대로)'],
  [24, 'r', '補充の人も当たったことないそうです', 'Even the restocking guy never won', '聽說補貨的人也沒中過', '보충하는 분도 당첨된 적 없대요'],
  [0, 'r', '夢は150円で買えます。当たりは別売りです', 'Dreams cost 150 yen. Wins sold separately.', '夢想150日圓。中獎另售', '꿈은 150엔. 당첨은 별매'],
  [23, 'r', '飲み終わる前に次を買うタイプですね', 'You buy the next before finishing this one, huh', '你是還沒喝完就買下一罐的類型吧', '다 마시기 전에 또 사는 타입이군요'],
  [0, 'r', 'その指、あたたまってきましたね', "Your finger's warming up", '你的手指熱起來了呢', '손가락이 풀리고 있네요'],
  [0, 'r', 'ここまで来たら引けませんね', 'No turning back now', '都到這裡了，不能回頭了吧', '여기까지 왔으니 못 물러나죠'],
  [24, 'r', 'はずれです。知ってました', 'Miss. I knew it.', '沒中。我早就知道了', '꽝입니다. 알고 있었어요'],
  [0, 'r', '当たりは入ってます。本当です', 'There are wins in here. Really.', '裡面真的有獎。真的', '당첨은 들어 있어요. 진짜로'],
  [23, 'r', '次の1本が当たりかもしれないのに？', 'What if the next one is the winner?', '說不定下一罐就中了喔？', '다음 한 캔이 당첨일 수도 있는데?'],
  [0, 'r', 'やめるなら今です。やめませんよね', "Quit now. You won't, though.", '要收手就趁現在。你不會收吧', '그만두려면 지금이에요. 안 그만두죠?'],
  [0, 'p2', '2つそろいました。何も出ません', 'Two matched. You get nothing.', '中了兩個。什麼都沒有', '두 개 맞았어요. 아무것도 없음'],
  [23, 'p2', '2つまでは誰でもそろいます', 'Anyone can match two', '兩個誰都能中', '두 개까지는 누구나 맞아요'],
  // ---- 数字の形で笑わせる（22種類） ----
  [22, 'z8', '8888！…当たりは1〜7だけです', '8888! ...Only 1 to 7 win.', '8888！…只有1到7才算', '8888! …당첨은 1~7뿐'],
  [22, 'z9', '9999。きれいですね。はずれです', '9999. Pretty. Still a miss.', '9999。很漂亮。沒中', '9999. 예쁘네요. 꽝'],
  [22, 'z0', '0000。ゼロはゼロです', '0000. Zero is zero.', '0000。零就是零', '0000. 제로는 제로'],
  [22, 'z8', 'ゾロ目！…の、対象外', 'Four of a kind! ...the wrong kind.', '四個一樣！…但不算', '같은 숫자! …대상 외'],
  [22, 'z9', '9が4つ。苦が4つ', 'Four nines. Four times nothing.', '四個9。四倍的苦', '9가 네 개. 고생도 네 배'],
  [22, 'z0', 'まっさら。あなたの戦績と同じ', 'Blank. Like your record.', '一片空白。跟你的戰績一樣', '텅 비었네요. 당신 전적처럼'],
  [0, 's+', '{d}。ならんだだけです', "{d}. A nice row. That's all.", '{d}。只是排好而已', '{d}. 줄만 섰네요'],
  [23, 's+', '階段みたいですね。上がれませんけど', 'Looks like stairs. Going nowhere.', '像樓梯一樣。但上不去', '계단 같네요. 못 올라가지만'],
  [0, 's-', '{d}。下り坂ですね', '{d}. All downhill.', '{d}。一路下坡呢', '{d}. 내리막이네요'],
  [24, 's-', 'カウントダウンかと思いました', 'Thought it was a countdown', '還以為在倒數', '카운트다운인 줄'],
  [0, 'mr', '{d}。左右対称。意味はないです', '{d}. Symmetrical. Meaningless.', '{d}。左右對稱。沒有意義', '{d}. 좌우 대칭. 의미 없음'],
  [0, 'ab', '{d}。リズムはいいですね', '{d}. Nice rhythm, at least.', '{d}。節奏不錯', '{d}. 리듬은 좋네요'],
  [23, 'l3', '後ろ3つはそろってるんですけどね', 'The last three match, though', '後面三個有中啦', '뒤 세 개는 맞았는데요'],
  [24, 'l3', '最初の1つが空気を読みませんでした', "The first digit didn't read the room", '第一個數字不會看氣氛', '첫 숫자가 눈치가 없네요'],
  [0, 'g:4649', '4649（ヨロシク）。こちらこそ', '4649. In Japanese that reads "nice to meet you". Likewise.', '4649（請多指教）。彼此彼此', '4649(잘 부탁해요). 저야말로'],
  [0, 'g:2525', '2525（ニコニコ）。笑うしかないですね', '2525 ("smile, smile"). Might as well.', '2525（笑咪咪）。只能笑了', '2525(싱글벙글). 웃을 수밖에'],
  [23, 'g:3150', '3150（最高）。結果は最低です', '3150 ("the best"). The result is the worst.', '3150（最棒）。結果最爛', '3150(최고). 결과는 최악'],
  [0, 'g:0840', '0840（おはよう）。目は覚めましたか', '0840 ("good morning"). Awake yet?', '0840（早安）。醒了嗎', '0840(좋은 아침). 정신 드셨나요'],
  [0, 'g:1192', '1192。いい国つくれそうですね', '1192. A fine year to start a shogunate.', '1192。好像可以建個幕府', '1192. 막부라도 세울까요'],
  [24, 'g:8739', '8739（花咲く）。咲きませんでした', '8739 ("flowers bloom"). Nothing bloomed.', '8739（花開）。沒開', '8739(꽃 핀다). 안 폈어요'],
  [0, 'g:0141', '0141（おいしい）。味はたしかです', '0141 ("tasty"). The drink is, anyway.', '0141（好喝）。味道是真的', '0141(맛있어). 맛은 확실해요'],
  [23, 'g:3776', '3776。富士山の高さです。登ります？', "3776. Mt. Fuji's height in meters. Fancy a climb?", '3776。富士山的高度。要爬嗎？', '3776. 후지산 높이예요. 오를래요?'],
  // ---- リーチ（22種類） ----
  [1, 'x+', '惜しい！ あと1つ！（毎回言ってます）', 'So close! One off! (I say that every time)', '好可惜！差一個！（我每次都這樣說）', '아깝다! 하나 차이! (매번 하는 말)'],
  [1, 'x+', '3つそろって、4つ目で裏切る。それがわたし', "Three match, the fourth betrays. That's me.", '中三個，第四個背叛。這就是我', '세 개 맞고 네 번째에 배신. 그게 저예요'],
  [1, 'x+', 'リーチでした。リーチ「でした」', 'That was a near-win. "Was."', '剛剛聽牌了。「剛剛」', '리치였어요. "였어요"'],
  [2, 'x-', '1つ手前で止まりました。わざとじゃないです', 'Stopped one short. Not on purpose.', '停在前一格。不是故意的', '한 칸 앞에서 멈췄어요. 일부러 아님'],
  [2, 'x-', 'あと1コマ。あと1コマだったのに', 'One more tick. Just one.', '再一格。就差一格', '한 칸만 더. 딱 한 칸이었는데'],
  [2, 'x-', '届きませんでした。気持ちは届きました', "Didn't reach. Your feelings did.", '沒到。心意有到', '닿지 않았어요. 마음은 닿았어요'],
  [3, 'x+', 'いま止まったと思いました？ すべりました', 'Thought it stopped? It slipped.', '以為停了？滑過去了', '멈춘 줄 알았죠? 미끄러졌어요'],
  [3, 'x+', '一瞬そろいました。一瞬', 'It matched for a moment. A moment.', '有一瞬間中了。一瞬間', '한순간 맞았어요. 한순간'],
  [3, 'x+', 'すべるのは自販機の仕様です', 'Slipping is a feature', '滑過去是販賣機的規格', '미끄러지는 건 사양입니다'],
  [4, 'x-', '行って、戻って、通りすぎました', 'Went past, came back, went past again', '過去、回來、又過去了', '갔다가, 돌아왔다가, 지나쳤어요'],
  [4, 'x-', '迷ったんです。迷った結果、はずれです', 'I hesitated. Then chose a miss.', '我猶豫了。猶豫的結果是沒中', '고민했어요. 고민 끝에 꽝'],
  [4, 'x-', '逆回転に意味はありません', 'The reverse spin means nothing', '逆轉沒有任何意義', '역회전에 의미는 없어요'],
  [5, 'x+', 'ドキドキしました？ わたしはしてません', "Heart pounding? Mine wasn't.", '心跳加速了嗎？我沒有', '두근거렸나요? 저는 아니에요'],
  [5, 'x-', '長かったですね。結果は同じです', 'That took a while. Same result.', '好久喔。結果一樣', '길었죠. 결과는 같아요'],
  [5, 'x+', '心臓の音、こっちまで聞こえました', 'I could hear your heartbeat from here', '你的心跳我都聽到了', '심장 소리가 여기까지 들렸어요'],
  [21, 'd3', '2つそろって、3つ目で終わり。早かったですね', 'Two matched, the third ended it. Quick.', '中兩個，第三個就結束。真快', '두 개 맞고 세 번째에 끝. 빠르네요'],
  [21, 'd3', '3つ目、あんなに回る必要ありました？', 'Did the third one need to spin that long?', '第三個有必要轉那麼久嗎？', '세 번째가 그렇게 오래 돌 필요가?'],
  [1, 'x+', 'あと1つは、いつも遠い', 'That last one is always far', '最後一個永遠最遠', '마지막 하나는 늘 멀어요'],
  [2, 'x-', '1つ足りない。人生みたいですね', 'One short. Like life.', '少一個。跟人生一樣', '하나 모자라요. 인생 같죠'],
  [1, 'x+', '「次は当たる気がする」って顔してます', 'You have that "next one\'s the one" face', '你一臉「下次會中」的表情', '"다음엔 될 것 같다"는 얼굴이네요'],
  [3, 'x+', '見ました？ いまの、そろってましたよね？', 'Did you see that? It matched, right?', '看到了嗎？剛剛有中對吧？', '봤어요? 방금 맞았었죠?'],
  [5, 'x-', '期待させてすみません。またやります', "Sorry for getting your hopes up. I'll do it again.", '抱歉讓你期待了。我還會再犯', '기대하게 해서 죄송. 또 할 거예요'],
  // ---- 熱い予告で外れる（18種類） ----
  [6, 'x+', '虹色に光りました。光っただけです', "It flashed rainbow. That's all it did.", '閃了彩虹光。只是閃而已', '무지개빛이 났어요. 빛나기만'],
  [6, 'r', '虹は出ました。当たりは出てません', "A rainbow appeared. A win didn't.", '彩虹出來了。獎沒出來', '무지개는 떴어요. 당첨은 안 떴어요'],
  [7, 'x+', '「アツい！」と言いました。ウソです', 'I said "HOT!" I lied.', '我說了「超熱！」。騙你的', '"뜨겁다!"고 했죠. 거짓말이에요'],
  [7, 'x-', '熱かったのは演出だけです', 'Only the show was hot', '熱的只有演出', '뜨거운 건 연출뿐'],
  [8, 'x+', 'ゆれました。地震ではありません。はずれです', 'It shook. Not an earthquake. A miss.', '搖了。不是地震。是沒中', '흔들렸어요. 지진 아님. 꽝'],
  [9, 'x-', '金色のオーラ、きれいでしたね', "Lovely golden aura, wasn't it", '金色光環，很漂亮吧', '금빛 오라, 예뻤죠'],
  [10, 'x+', '雷まで落としたのに、はずれです', 'Even dropped a thunderbolt. Still a miss.', '連雷都打了，還是沒中', '번개까지 쳤는데 꽝'],
  [11, 'x+', '3、2、1、はずれ！', '3, 2, 1, miss!', '3、2、1、沒中！', '3, 2, 1, 꽝!'],
  [12, 'x-', 'サイレン鳴らしてみました。意味はないです', 'Tried the siren. No reason.', '試著響了警報。沒有意義', '사이렌 울려 봤어요. 의미 없음'],
  [13, 'x+', '紙吹雪、フライングでした。回収します', 'The confetti jumped the gun. Taking it back.', '彩帶偷跑了。回收', '꽃가루가 부정 출발. 회수합니다'],
  [14, 'x+', '「あた…」まで言いかけました', 'I almost said "WIN..."', '差點說出「中…」', '"당첨…"까지 말할 뻔했어요'],
  [15, 'r', '缶が行進しました。それだけです', "The cans marched. That's it.", '罐子遊行了。就這樣', '캔들이 행진했어요. 그게 다예요'],
  [16, 'x-', 'ボタンを全部光らせました。電気代のムダでした', 'Lit every button. Waste of electricity.', '把按鈕全點亮了。浪費電', '버튼을 전부 켰어요. 전기 낭비'],
  [17, 'x+', 'ズームしました。寄っても変わりません', 'Zoomed in. Changes nothing.', '拉近了。拉近也一樣', '줌 했어요. 가까이 봐도 똑같음'],
  [18, 'x-', '暗くしました。雰囲気づくりです', 'Dimmed the lights. For the mood.', '把燈關暗了。營造氣氛', '어둡게 했어요. 분위기용'],
  [19, 'r', 'UFOが通りました。当たりとは無関係です', 'A UFO flew by. Unrelated.', 'UFO飛過去了。跟中獎無關', 'UFO가 지나갔어요. 당첨과 무관'],
  [20, 'r', '猫が通りました。かわいかったですね', 'A cat walked by. Cute, right?', '貓走過去了。很可愛吧', '고양이가 지나갔어요. 귀엽죠'],
  [25, 'x+', '全部のせでした。はずれです', 'The full works. Still a miss.', '全部加上了。還是沒中', '풀코스였어요. 그래도 꽝']
];
// 出やすさ：ふつう（0〜37）54%・数字ネタ（38〜59）10%・リーチ（60〜81）24%・熱い予告（82〜99）12%
export const LGROUP = [[0, 38, .54], [38, 60, .10], [60, 82, .24], [82, 100, .12]];
const LI = { ja: 2, en: 3, zh: 4, ko: 5 };
export function loseLine(i, lang, d) { const e = LOSE[i]; return e ? String(e[LI[lang] || 2]).split('{d}').join(d) : ''; }

// ===== くじ =====
export function mulberry(a) { a >>>= 0; return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function digitsFor(p, R) {
  const ri = n => Math.floor(R() * n);
  if (p[0] === 'g') return p.slice(2).split('').map(Number);
  if (p === 'z8') return [8, 8, 8, 8]; if (p === 'z9') return [9, 9, 9, 9]; if (p === 'z0') return [0, 0, 0, 0];
  if (p === 's+') { const a = ri(7); return [a, a + 1, a + 2, a + 3]; }
  if (p === 's-') { const a = 3 + ri(7); return [a, a - 1, a - 2, a - 3]; }
  if (p === 'mr') { const a = ri(10); let b = ri(9); if (b >= a) b++; return [a, b, b, a]; }
  if (p === 'ab') { const a = ri(10); let b = ri(9); if (b >= a) b++; return [a, b, a, b]; }
  if (p === 'l3') { const x = 1 + ri(7); let a = ri(9); if (a >= x) a++; return [a, x, x, x]; }
  if (p === 'x+') { const x = 1 + ri(7); return [x, x, x, x + 1]; }
  if (p === 'x-') { const x = 1 + ri(7); return [x, x, x, x - 1]; }
  if (p === 'p2') { const x = 1 + ri(7); let c = ri(9); if (c >= x) c++; return [x, x, c, ri(10)]; }
  if (p === 'd3') { const x = 1 + ri(7); return [x, x, x + (R() < .5 ? 1 : -1), ri(10)]; }
  for (; ;) { const d = [ri(10), ri(10), ri(10), ri(10)]; if (d[0] === d[1]) continue; if (d[1] === d[2] && d[2] === d[3]) continue; return d; }
}
// 1本ぶんの結果を作る。r1〜r3 は 0以上1未満のくじ（本番は暗号用の乱数、試験では決めた数）
export function makeSeq(seed, r1, r2, r3, force) {
  const R = mulberry(seed);
  let win = r1 < PWIN, c = -1, li = -1, d;
  if (force && force.win != null) win = !!force.win;
  if (win) {
    c = Math.min(NCOL - 1, Math.floor(r2 * NCOL)); if (force && force.c != null) c = force.c;
    d = [c + 1, c + 1, c + 1, c + 1];
    // 当たるときの見せ方：wv=止まり方（0そのまま 1すべりこみ 2行って戻る 3長い鼓動） pre=前ぶれの演出
    const wv = [0, 0, 0, 1, 1, 2, 3, 3][Math.floor(R() * 8)];
    const pre = [0, 0, 0, 0, 6, 7, 8, 9, 10, 11, 12, 16, 17, 18][Math.floor(R() * 14)];
    return { seed, win: true, c, d, li: -1, g: pre, wv: force && force.wv != null ? force.wv : wv };
  }
  if (force && force.li != null) li = force.li;
  else { let acc = 0; li = 0; for (const [a, b, w] of LGROUP) { if (r2 < acc + w || b === 100) { li = a + Math.min(b - a - 1, Math.floor(r3 * (b - a))); break; } acc += w; } }
  const e = LOSE[li]; d = digitsFor(e[1], R);
  return { seed, win: false, c: -1, d, li, g: e[0], wv: 0 };
}
