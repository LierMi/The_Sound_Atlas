// 时空数据（单一数据源，数据驱动整个流程）
// 摘要字段：地图定位用（title/period/place/accent/status/lat/lon）
// 内容字段：展厅用（curatorNote + exhibits）—— status:'open' 的才需要填满
//   exhibits 单项：no/song/artist/year/lyric/note/tags/accent/cover
// 加一个新展厅 = 在这里加一条完整数据即可，无需改组件

export const eras = [
  {
    id: 'hk-golden-era',
    title: '港乐黄金时代',
    period: '1983-1993',
    place: '香港',
    accent: '#c9a24b',
    status: 'open',
    playlistCount: 32, // 完整歌单首数（会员解锁钩子用）
    lat: 22.3,
    lon: 114.2,
    curatorNote:
      '欢迎来到港乐黄金时代展厅。1983 到 1993，这座城市用粤语写就了华人世界最辉煌的十年——情歌、理想，与一整代人的青春，都封存在这里的藏品中。请戴上耳机，慢慢走。',
    exhibits: [
      {
        no: '001',
        song: '海阔天空',
        artist: 'Beyond',
        year: 1993,
        lyric: '原谅我这一生不羁放纵爱自由',
        note: '黄家驹生前最后的告白。它后来成了无数人面对世界时，唯一会唱的那首歌。',
        tags: ['自由', '理想', '摇滚'],
        accent: '#6e7f9c',
        cover:
          'https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/9f/6d/62/9f6d62cd-c6fd-1037-fe9b-df8d6d752a3c/dj.isfwsfsf.jpg/300x300bb.jpg',
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b4/65/eb/b465eb10-3fac-be03-eb7b-c4b7bf61dcf6/mzaf_12496276653832964155.plus.aac.p.m4a',
      },
      {
        no: '002',
        song: '风继续吹',
        artist: '张国荣',
        year: 1983,
        lyric: '风继续吹，不忍远离',
        note: '哥哥的声音里有种危险的温柔。1983 年的他还不知道，自己会成为一个时代的符号。',
        tags: ['深情', '巨星'],
        accent: '#8a7fa3',
        cover:
          'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ee/f4/b8/eef4b8c6-f631-274a-635d-5216b51fb137/825646271450.jpg/300x300bb.jpg',
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b7/e5/45/b7e545ad-f946-d987-bed3-a8c2c11a36dd/mzaf_6199640026609119347.plus.aac.p.m4a',
      },
      {
        no: '003',
        song: '似水流年',
        artist: '梅艳芳',
        year: 1985,
        lyric: '望着海一片，满怀倦，无泪也无言',
        note: '喜多郎作曲，梅艳芳演唱。香港最好的嗓子，唱尽了时间的无可奈何。',
        tags: ['时间', '苍凉'],
        accent: '#5f8a8b',
        cover:
          'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a6/41/59/a641591f-e2bf-57f6-215d-d903e478910c/825646269396.jpg/300x300bb.jpg',
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/79/3c/b2/793cb21b-a18b-0be6-a23a-c9af68845fdf/mzaf_13523369801732104100.plus.aac.p.m4a',
      },
      {
        no: '004',
        song: '朋友',
        artist: '谭咏麟',
        year: 1985,
        lyric: '繁星流动，和你同路',
        note: '不是情歌，却胜过情歌。整整一代人的散伙饭上，都放过这一首。',
        tags: ['友情', '怀旧'],
        accent: '#b08968',
        cover:
          'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/41/48/f7/4148f7d0-646e-a696-fcfb-8e68d00d4e23/00042282463920.rgb.jpg/300x300bb.jpg',
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bf/15/a5/bf15a562-7102-d4f9-076a-72c58b948e1c/mzaf_305912770112393461.plus.aac.p.m4a',
      },
      {
        no: '005',
        song: '狮子山下',
        artist: '罗文',
        year: 1979,
        lyric: '同舟人，誓相随',
        note: '香港的"非官方市歌"。一首电视剧主题曲，唱的是一座城市同舟共济的集体精神。',
        tags: ['城市', '集体记忆'],
        accent: '#9c6e5a',
        cover:
          'https://is1-ssl.mzstatic.com/image/thumb/Features4/v4/a5/11/45/a5114579-6b28-2682-4ae8-153f15db9255/dj.fozmkyqy.jpg/300x300bb.jpg',
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/74/fd/35/74fd358f-f35f-bdae-ae54-e5b3b290fe72/mzaf_10064247209050951769.plus.aac.p.m4a',
      },
      {
        no: '006',
        song: '光辉岁月',
        artist: 'Beyond',
        year: 1990,
        lyric: '风雨中抱紧自由',
        note: '黄家驹写给曼德拉的歌。华语摇滚第一次，把个人理想和一整个时代的渴望唱在了一起。',
        tags: ['理想', '抗争'],
        accent: '#c9a24b',
        cover:
          'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fe/95/73/fe957371-e8c8-acd2-f711-e7dd26274e77/08UMGIM02297.rgb.jpg/300x300bb.jpg',
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7a/36/be/7a36bedc-9f3b-2ee6-1306-076f658c5dbb/mzaf_16817114461113478335.plus.aac.p.m4a',
      },
      {
        no: '007',
        song: '真的爱你',
        artist: 'Beyond',
        year: 1989,
        lyric: '是你多么温馨的目光',
        note: '写给母亲的摇滚。Beyond 证明了，最硬的吉他也能装下最柔软的情感。',
        tags: ['亲情', '摇滚'],
        accent: '#a8674a',
        cover:
          'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fe/95/73/fe957371-e8c8-acd2-f711-e7dd26274e77/08UMGIM02297.rgb.jpg/300x300bb.jpg',
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b3/ea/e9/b3eae90c-569a-b5d4-6eb3-70932f2566c2/mzaf_7026662266641563421.plus.aac.p.m4a',
      },
    ],
    routeTitle: '跟着港乐去旅行',
    routeSubtitle: '一条从舞台、山脊、海港到旧唱片铺的声音路线。',
    routeStops: [
      {
        no: '01',
        place: '红磡',
        time: '1983 夜场',
        title: '演唱会与巨星时代',
        cue: '张国荣 / 梅艳芳 / 谭咏麟',
        coord: '22.31°N · 114.18°E',
        map: { x: 72, y: 56 }, // 中东 · 海港侧
        note: '从红馆的聚光灯出发，港乐不再只是唱片里的声音，而是一座城市共同仰望的舞台。',
        detail:
          '红磡体育馆——香港人口中的「红馆」。1983 年启用后，它成了粤语流行的圣殿：谭咏麟的劲歌热舞、梅艳芳千变万化的舞台、张国荣 1989 年那场轰动的「告别歌坛」演唱会，都在这里把唱片里的声音，变成万人合唱的现场。',
        landmarks: ['红磡体育馆', '海底隧道口', '黄埔花园'],
      },
      {
        no: '02',
        place: '狮子山',
        time: '城市晨光',
        title: '奋斗与集体精神',
        cue: '罗文《狮子山下》',
        coord: '22.35°N · 114.18°E',
        map: { x: 55, y: 14 }, // 最北 · 山脊
        note: '山不是风景背景，而是精神坐标。它把一代人的辛苦、互助和向上，压进一首歌里。',
        detail:
          '狮子山横亘在九龙与新界之间，山脚下是密密麻麻的公共屋邨。1979 年罗文唱响《狮子山下》——「同舟人，誓相随」，把战后香港人捱苦、互助、向上的集体记忆，凝成一座城市的精神坐标。',
        landmarks: ['狮子山郊野公园', '乐富 / 黄大仙', '慈云山公屋'],
      },
      {
        no: '03',
        place: '维港',
        time: '1990 风起时',
        title: '流行文化输出口岸',
        cue: 'Beyond《光辉岁月》',
        coord: '22.29°N · 114.17°E',
        map: { x: 50, y: 84 }, // 最南 · 海港
        note: '海港连着世界，也连着理想。摇滚、电影和粤语歌从这里出发，越过地域成为共同记忆。',
        detail:
          '维多利亚港——香港通向世界的门户。1990 年 Beyond《光辉岁月》写给曼德拉，粤语歌第一次把个人理想唱成跨越地域的共同渴望；港乐、港片正是从这片海港出发，影响了整个华语世界。',
        landmarks: ['尖沙咀海旁', '天星码头', '中环维港'],
      },
      {
        no: '04',
        place: '旧唱片铺',
        time: '私人午后',
        title: '把你的记忆放进去',
        cue: '一张黑胶 / 一句旧歌词',
        coord: '22.32°N · 114.17°E',
        map: { x: 28, y: 40 }, // 偏西 · 旺角深水埗
        note: '旅程最后停在一间旧唱片铺。这里不再讲宏大的时代，只收下你和某首歌之间的小故事。',
        detail:
          '旅程的终点，藏在旺角、深水埗的旧唱片铺里。褪色的黑胶封套、手写的价签、积灰的卡带——这里不再讲宏大的时代，只等你抽出一张唱片，接上你和某首歌之间，那个只属于你的午后。',
        landmarks: ['旺角信和中心', '深水埗鸭寮街', '湾仔旧书唱片店'],
      },
    ],
  },

  {
    id: 'mandopop-chinese-style',
    title: '千禧中国风',
    period: '2003-2008',
    place: '台北 · 华语',
    accent: '#7f9c6e',
    status: 'open',
    playlistCount: 28, // 完整歌单首数（会员解锁钩子用）
    lat: 25.0,
    lon: 121.5,
    curatorNote:
      '2003 年，一批华语音乐人做了件没人敢做的事——让流行乐"向后看"，从京剧、昆曲、唐诗与水墨里找回了未来。一代人就这样在 R&B 与嘻哈的节拍里，重新背会了古典。',
    exhibits: [
      {
        no: '001',
        song: '东风破',
        artist: '周杰伦',
        year: 2003,
        lyric: '谁在用琵琶弹奏，一曲东风破',
        note: '中国风的开山之作。琵琶、二胡与 R&B 的转音第一次严丝合缝，从此华语情歌有了古典的骨。',
        tags: ['中国风', '开山', '琵琶'],
        accent: '#a8674a',
        cover:
          'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8c/47/86/8c47862d-e254-8b49-30cf-d1f05ebba05b/23UM1IM56855.rgb.jpg/300x300bb.jpg',
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/8b/4d/f8/8b4df84a-5e74-1981-1ace-bf4a0652358d/mzaf_3751603333740041846.plus.aac.p.m4a',
      },
      {
        no: '002',
        song: 'Susan说',
        artist: '陶喆',
        year: 2005,
        lyric: '苏三离了洪洞县',
        note: '陶喆把京剧《苏三起解》的唱段揉进 R&B，让苏三的冤屈，在世纪末的节拍里重新开口。',
        tags: ['京剧', 'R&B', '混血'],
        accent: '#b3826a',
        cover:
          'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fe/ad/e7/feade7c8-826b-0379-fbf4-e59606db8e4c/825646245406.jpg/300x300bb.jpg',
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/3c/95/49/3c9549ae-2e0f-8dfc-ee40-6b75f687ce52/mzaf_7593626819349000504.plus.aac.p.m4a',
      },
      {
        no: '003',
        song: '花田错',
        artist: '王力宏',
        year: 2005,
        lyric: '花田里犯了错，说好破晓前忘掉',
        note: '取自同名京剧。王力宏以花脸唱腔起调，把一段错过的爱情，唱成了戏台上的一个身段。',
        tags: ['京剧', '唱腔', '错过'],
        accent: '#9c6e7f',
        cover:
          'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f9/82/88/f98288eb-ea32-6c8c-7919-357c31a4b437/1400X1400.jpg/300x300bb.jpg',
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/4a/fd/9b/4afd9ba7-e0a8-84fb-115e-ee62638e125c/mzaf_3013998573688034577.plus.aac.p.m4a',
      },
      {
        no: '004',
        song: '江南',
        artist: '林俊杰',
        year: 2004,
        lyric: '风到这里就是黏，黏住过客的思念',
        note: '不是严格的中国风，却有最浓的古韵。一句"风到这里就是黏"，把江南的湿意与缠绵都唱化了。',
        tags: ['古韵', '江南', '缠绵'],
        accent: '#5f8a8b',
        cover:
          'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/97/b6/4f/97b64fc0-ef82-19d3-06b8-26a57b8daae2/dj.qzfbgnvr.jpg/300x300bb.jpg',
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/2e/78/a7/2e78a71b-77c6-b74e-6c64-019c9b2b1dc2/mzaf_5531305846075528000.plus.aac.p.m4a',
      },
      {
        no: '005',
        song: '在梅边',
        artist: '王力宏',
        year: 2005,
        lyric: '在梅边，落花似雪纷飞',
        note: '他把汤显祖《牡丹亭》四百年前的昆曲唱段，直接嵌进 21 世纪的嘻哈。杜丽娘与 R&B 同台。',
        tags: ['昆曲', '嘻哈', '混血'],
        accent: '#7f9c8a',
        cover:
          'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f9/82/88/f98288eb-ea32-6c8c-7919-357c31a4b437/1400X1400.jpg/300x300bb.jpg',
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/34/0d/c5/340dc55d-d9f4-e42f-6a88-5109f4de7aff/mzaf_15646874245166113901.plus.aac.p.m4a',
      },
      {
        no: '006',
        song: '青花瓷',
        artist: '周杰伦',
        year: 2007,
        lyric: '天青色等烟雨，而我在等你',
        note: '方文山写的是宋瓷的工艺，唱的是等一个人的心境。这是华语流行第一次，让一首歌像一件文物。',
        tags: ['中国风', '宋瓷', '婉约'],
        accent: '#6e8fa3',
        cover:
          'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f7/2c/9f/f72c9fc6-c4dc-d6a0-4386-0478b09cb797/23UM1IM58609.rgb.jpg/300x300bb.jpg',
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/e7/2a/12/e72a12e3-f2f8-5ecb-15d7-54aab7100ee8/mzaf_2373538062810778845.plus.aac.p.m4a',
      },
    ],
    routeTitle: '跟着中国风去旅行',
    routeSubtitle: '一条从戏台、水乡、瓷窑到唱片行的声音路线——千禧年的流行乐，是怎样把古典请回来的。',
    routeStops: [
      {
        no: '01',
        place: '台北',
        time: '2003 千禧',
        title: '华语乐坛的起点',
        cue: '周杰伦《东风破》',
        coord: '25.03°N · 121.56°E',
        map: { x: 82, y: 74 }, // 最东 · 海岛
        note: '一切从这里开始。2003 年的台北，一批音乐人决定让流行乐「向后看」，从古典里找回未来。',
        detail:
          '2003 年，周杰伦《东风破》在台北横空出世——琵琶、二胡与 R&B 的转音第一次严丝合缝。以台北为圆心，陶喆、王力宏、林俊杰相继出手，「中国风」从一种尝试，变成一整代华语流行的集体转向。',
        landmarks: ['西门町唱片行', '阿尔发音乐', 'Live House'],
      },
      {
        no: '02',
        place: '京城戏楼',
        time: '皮黄锣鼓',
        title: '京剧的根',
        cue: '陶喆《Susan说》/ 王力宏《花田错》',
        coord: '39.90°N · 116.40°E',
        map: { x: 56, y: 14 }, // 最北 · 戏台
        note: '中国风往北走，撞进京剧的锣鼓。苏三的冤屈、花田的错爱，都从戏台上重新开口。',
        detail:
          '陶喆把《苏三起解》的西皮唱段揉进 R&B，让山西洪洞县的苏三在世纪末的节拍里喊冤；王力宏以花脸唱腔起《花田错》。北方戏曲的程式与唱念，成了中国风最硬的一块骨头。',
        landmarks: ['正乙祠戏楼', '湖广会馆', '长安大戏院'],
      },
      {
        no: '03',
        place: '江南水乡',
        time: '杏花烟雨',
        title: '婉约与昆曲',
        cue: '林俊杰《江南》/ 王力宏《在梅边》',
        coord: '31.30°N · 120.58°E',
        map: { x: 70, y: 48 }, // 中东南 · 水乡
        note: '再往南，是湿漉漉的江南。一句「风到这里就是黏」，把缠绵都唱化了。',
        detail:
          '林俊杰《江南》把水乡的湿意与思念唱成黏稠的暖；王力宏《在梅边》把汤显祖《牡丹亭》四百年前的昆曲唱段直接嵌进嘻哈，让杜丽娘与 R&B 同台。江南的婉约，是中国风最柔的底色。',
        landmarks: ['苏州园林', '周庄古镇', '昆曲水磨腔'],
      },
      {
        no: '04',
        place: '景德镇',
        time: '天青等烟雨',
        title: '青花瓷的窑火',
        cue: '周杰伦《青花瓷》',
        coord: '29.27°N · 117.18°E',
        map: { x: 52, y: 62 }, // 中南 · 瓷都
        note: '旅程的终点在瓷都。方文山写的是宋瓷的工艺，唱的是等一个人的心境。',
        detail:
          '《青花瓷》让一首歌像一件文物——「天青色等烟雨，而我在等你」，唱的是釉色，也是等待。景德镇的窑火烧了千年，中国风在这里把工艺、诗词与流行旋律，烧结成同一件器物。',
        landmarks: ['古窑民俗博览区', '陶溪川', '御窑厂遗址'],
      },
    ],
  },

  // —— 以下为策划案定稿占位时空（status:'soon'），内容待填 ——
  {
    id: 'nyc-jazz-1959',
    title: '1959 纽约爵士',
    period: '1959',
    place: '纽约',
    accent: '#6e7f9c',
    status: 'soon',
    lat: 40.7,
    lon: -74.0,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'beijing-rock-90s',
    title: '90 年代北京摇滚',
    period: '1990s',
    place: '北京',
    accent: '#a8674a',
    status: 'soon',
    lat: 39.9,
    lon: 116.4,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'britpop-london',
    title: 'Britpop 伦敦',
    period: '1993-1997',
    place: '伦敦',
    accent: '#8a7fa3',
    status: 'soon',
    lat: 51.5,
    lon: -0.12,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'florence-early-music',
    title: '文艺复兴·佛罗伦萨古乐',
    period: '文艺复兴',
    place: '佛罗伦萨',
    accent: '#b08968',
    status: 'soon',
    lat: 43.77,
    lon: 11.25,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'egypt-mummy-ritual',
    title: '埃及木乃伊秘仪',
    period: '公元前 1300',
    place: '尼罗河',
    accent: '#d2b069',
    status: 'soon',
    lat: 26.8,
    lon: 30.8,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'hippie-san-francisco',
    title: '嬉皮士年代',
    period: '1967',
    place: '旧金山',
    accent: '#d9856b',
    status: 'soon',
    lat: 37.77,
    lon: -122.42,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'vienna-classical',
    title: '维也纳古典',
    period: '18 世纪',
    place: '维也纳',
    accent: '#b8a579',
    status: 'soon',
    lat: 48.2,
    lon: 16.37,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'new-orleans-jazz',
    title: '新奥尔良爵士',
    period: '1920s',
    place: '新奥尔良',
    accent: '#6f9c8a',
    status: 'soon',
    lat: 29.95,
    lon: -90.07,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'berlin-electronic',
    title: '柏林电子',
    period: '1990s',
    place: '柏林',
    accent: '#6e8fa3',
    status: 'soon',
    lat: 52.52,
    lon: 13.4,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'jamaica-reggae',
    title: '牙买加雷鬼',
    period: '1970s',
    place: '金斯敦',
    accent: '#8fa85f',
    status: 'soon',
    lat: 18.0,
    lon: -76.8,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'brazil-tropicalia',
    title: '巴西热带主义',
    period: '1968',
    place: '巴伊亚',
    accent: '#c7a84f',
    status: 'soon',
    lat: -12.97,
    lon: -38.5,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'argentina-tango',
    title: '阿根廷探戈',
    period: '1930s',
    place: '布宜诺斯艾利斯',
    accent: '#a8676f',
    status: 'soon',
    lat: -34.6,
    lon: -58.38,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'edo-floating-world',
    title: '江户浮世绘声景',
    period: '17 世纪',
    place: '江户',
    accent: '#6e9cc4',
    status: 'soon',
    lat: 35.68,
    lon: 139.76,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'chang-an-tang',
    title: '唐朝长安乐坊',
    period: '8 世纪',
    place: '长安',
    accent: '#c9864f',
    status: 'soon',
    lat: 34.34,
    lon: 108.94,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'bollywood-bombay',
    title: '宝莱坞孟买',
    period: '1970s',
    place: '孟买',
    accent: '#d47aa0',
    status: 'soon',
    lat: 19.07,
    lon: 72.88,
    curatorNote: '',
    exhibits: [],
  },
  {
    id: 'cyber-city-future',
    title: '未来赛博都会',
    period: '2088',
    place: '未知坐标',
    accent: '#7c8fd8',
    status: 'soon',
    lat: 1.35,
    lon: 103.8,
    curatorNote: '',
    exhibits: [],
  },
]

export const getEra = (id) => eras.find((e) => e.id === id)

// 数字纪念票序列号：确定性哈希（同一时代恒定），限量 9999 之内
export const serialOf = (id) => {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return String((h % 9999) + 1).padStart(4, '0')
}
