/* palette-notes.js — what each palette is about.
 *
 * Distilled from the "Colour Philosophy" and "Design logic" entries in
 * Thomas Shang's Tufte-Style Book Template:
 *   https://github.com/Hatsuyuki017/Thomas-Tufte-Style-Book-Template
 *
 * One short paragraph per palette per language. A language that is missing an
 * entry falls back to English rather than showing nothing, so a new palette
 * only strictly needs its English note.
 */
(function (window) {
  'use strict';

  var N = {};

  N.en = {
    'warm': 'The ledger’s own default: warm paper, a deep book-red, and two blues borrowed from ink and indigo. Built to sit under long stretches of text without ever raising its voice.',
    'ouc-default': 'A deep academic blue organised around scholarship, the sea, and structural order. Pale blue opens breathing room, navy carries authority, harbour blue closes the system — the most natural fit for prose and tables.',
    'brunneophobia': 'Fired earth, old wood, leather, and the residual heat of a kiln. Not cheerful browns but smoked ones; pale clay and charred earth stretch the extremes apart while burnt ochre compresses the middle.',
    'van-dyke': 'Old canvas, dusty rose, and faded indigo, moving in a low voice. Rose, violet, wine and brown-grey form an old-oil-painting continuum — quiet and literary rather than overtly dramatic.',
    'back-in-black': 'Near-monochrome with the residual warmth of dusty mauve: backstage velvet, mirrored dressing-room light. The restraint keeps the page from competing with its own layout, while the powder pink stops it feeling sterile.',
    'belle-of-the-ball': 'A vintage ballroom where porcelain blush, coral light and late olive meet under chandeliers. Coral delivers the theatrics, but the centre of gravity stays in olive, which keeps the whole thing from turning sugary.',
    'pine-tree': 'Distinctly autumnal: gold, ochre-orange, pine shadow and a muted berry transition turn the page into late woodland. Warm hues carry the remaining light; the deep greens keep the hush.',
    'provence-blue': 'Its beauty is in refusing postcard brightness — mist over stone walls, herb pots on a sill, evening over lavender. So much grey is built in that it stays cool without ever going hard.',
    'fresco-blue': 'Weathered murals and sea air etched into mineral surfaces: highlights thinned with lime and plaster, darks that look soaked into the wall. Its depth ladder is the clearest in the set.',
    'monet': 'Ivory, dusty coral, moss and dark teal in one atmosphere — less the flowers than the air inside the painting. Ivory and coral give immediate warmth while the teals hold the hierarchy firm.',
    'narcissus': 'Dry, warm and particulate: sand and old cloth at the pale end, weathered ochre through the middle, rust and scorched cedar at the dark end. Warm without sweetness, old without going inert.',
    'roman-empire': 'Stone, blood, power, ritual and triumph at once. Carrara marble is the architectural ground, two reds split state power into military and patrician registers, and gold and purple close the order.',
    'greece': 'Temple marble with civic blue leading the eye, gold as a controlled flare. Terracotta, olive and grape-purple restore the human, agricultural and theatrical complexity behind the white-marble cliché.',
    'kanagawa': 'Hokusai’s revolution in blue: Prussian blue as the spine, washi warmth and foam-white as the air around it, sumi ink closing the composition. That single-hue modulation is what makes it read as woodblock.',
    'starry-night': 'Three tiers of blue and the violent intrusion of yellow light. The cypress is the dark vegetal flame pulling the cosmic swirl back to earth; village amber is the only other warm note.',
    'a-thousand-li': 'The mineral layering of blue-green Chinese landscape painting. Azurite and malachite are sedimented into silk rather than laid on in blocks, with ochre-gold acting as the temperature valve.',
    'and-quiet-flows-the-don': 'Brightness refused altogether: muddy blue, dried-blood red, dead-reed yellow, and a grey that is frozen dust rather than abstract neutrality. Cold presses from above, earth bears the weight.',
    'cyberpunk-edgerunners': 'Built on overload, with no middle layer cushioning the void-dark base from the fluorescent highs. Blue is the only credible line of escape; red marks the bodily toll.',
    'grand-budapest-hotel': 'Old-European fairy-tale light. The pink is aged rose rather than girlish, the purple is etiquette and rank, and vanilla cream, dim gold and mist-blue keep the whole confection from tipping over.',
    'renaissance-florence': 'Colour extracted from materials rather than invented: lapis, gold leaf, baked clay, walnut, cypress, ivory gesso. Lapis and altar gold set the sacred register; cypress and walnut pull it back to the workshop.',
    'soviet-avant-garde': 'Harmony, gradient and ornament all refused. Each colour is a hard-edged declaration — red acts, black negates, grey bears industrial weight, blueprint blue thinks in diagrams.',
    'constantinople': 'A city that has to belong to Greece, Rome, Byzantium, Islam and the Ottomans at once. Deep blue and ochre form the east–west axis, gold, purple and ivory the sacred triangle, cypress the long historical shadow.',
    'france': 'The tricolour read as cultural matter, not political emblem: wine and blood in the red, champagne ivory for the white, Enlightenment gravity in the blue. Lavender and olive-gold open the fracture between north and south.',
    'kyoto': 'A city built on restraint, mist and aftertone. Silk-white, sakura-grey, bamboo-grey, weathered tea-brown, moss and dark indigo refuse brightness on purpose; vermilion is the one permitted flare.',
    'siamese-dream': 'A study in adolescent contradiction — overexposed light, soft focus, low-temperature orange and organic dark green. Its most beautiful tones are also its least trustworthy.'
  };

  N['zh-Hans'] = {
    'warm': '本账簿自带的默认配色：温暖的纸色、深沉的书籍红，以及两种取自墨与靛的蓝。它被设计成能长久托住大段文字，而从不提高嗓门。',
    'ouc-default': '一套围绕学术、海洋与秩序展开的深蓝体系。淡蓝腾出呼吸的余地，藏青承担权威，港湾蓝收束整体——最适合正文与表格。',
    'brunneophobia': '烧过的土、旧木、皮革，以及窑炉里残留的热度。这不是明快的棕，而是烟熏过的棕；淡陶土与焦土把两端拉开，赭橙则压紧中段。',
    'van-dyke': '旧画布、蒙尘的玫瑰与褪色的靛，低声说话。玫瑰、紫、酒红与褐灰构成一段旧油画式的连续——文气而安静，不作张扬的戏剧。',
    'back-in-black': '近乎单色，却留着尘紫的余温：后台的天鹅绒，化妆间镜前的光。这份克制让版面不与自身的结构争抢，而粉调的底色又让它不至于冷硬。',
    'belle-of-the-ball': '一间旧日舞厅，瓷粉、珊瑚色的灯光与迟暮的橄榄绿在吊灯下相遇。珊瑚色负责戏剧性，但重心始终落在橄榄绿上，因而不会流于甜腻。',
    'pine-tree': '明确的秋日气质：金、赭橙、松影，以及一道晦暗的浆果色过渡，把版面变成入夜前的林地。暖色承接余光，深色守住那份安静。',
    'provence-blue': '它的好，在于拒绝明信片式的明亮——石墙上的雾、窗台的香草盆、薰衣草田上的黄昏。因为掺了大量灰，它冷而不硬。',
    'fresco-blue': '风化的壁画，以及嵌进矿物表面的海气：亮部像被石灰和灰泥稀释过，暗部则像颜料渗进了墙里。它的深浅阶梯是全套中最清晰的。',
    'monet': '象牙白、蒙尘的珊瑚、苔绿与深青同处一种空气之中——与其说是花，不如说是画里的空气。象牙与珊瑚给出即刻的暖意，青绿则稳住层次。',
    'narcissus': '干燥、温暖而带颗粒感：浅处是沙与旧布，中段走过风化的赭，深处压进锈色与焦雪松。暖而不甜，旧而不死。',
    'roman-empire': '石、血、权力、仪典与凯旋要同时容纳其中。卡拉拉大理石是建筑的底面，两种红把国家权力分作军事与贵族两个声部，金与紫收束秩序。',
    'greece': '神庙的大理石作底，城邦蓝引着视线走，金色是受控的一次闪耀。赤陶、橄榄与葡萄紫，把白色大理石套语背后的人间、农事与戏剧还了回来。',
    'kanagawa': '北斋在蓝上的那场革命：普鲁士蓝是脊梁，和纸的暖与浪沫的白是它周围的空气，墨色收住整幅构图。正是这种单色调的变奏，让它读起来像木刻。',
    'starry-night': '三层蓝，以及黄色光线的猛烈闯入。柏树是那株深色的植物之火，把宇宙的漩涡拉回地面；村舍的琥珀色是仅有的另一处暖调。',
    'a-thousand-li': '青绿山水中矿物层叠的做法。石青与石绿不是生硬的色块，而是沉淀进绢里；赭金则充当温度的阀门。',
    'and-quiet-flows-the-don': '彻底拒绝明亮：浑浊的蓝、干血的红、枯苇的黄，以及一种并非抽象中性、而是冻结尘土般的灰。冷从上方压下来，土色承担重量。',
    'cyberpunk-edgerunners': '建立在过载之上，虚空般的暗底与荧光的高音之间没有任何缓冲。蓝是唯一可信的逃逸路线；红标记着肉身付出的代价。',
    'grand-budapest-hotel': '裹在旧欧洲童话的光里。粉不是少女的粉，而是陈旧的玫瑰；紫是礼节、身份与位阶。香草奶油、暗金与雾蓝，让这份甜点不至于翻倒。',
    'renaissance-florence': '颜色是从材料里取出来的，而非发明出来的：青金石、金箔、烧陶、胡桃木、柏树、象牙石膏。青金与祭坛金定下神圣的声部，柏与胡桃又把它拉回工坊。',
    'soviet-avant-garde': '和谐、渐变与装饰一概拒绝。每种颜色都是一句斩钉截铁的宣告——红行动，黑否定，灰承担工业的重量，蓝图之蓝以图解方式思考。',
    'constantinople': '一座必须同时属于希腊、罗马、拜占庭、伊斯兰与奥斯曼的城。深蓝与赭构成东西的轴，金、紫、象牙组成神圣的三角，柏绿投下漫长的历史阴影。',
    'france': '三色旗被当作文化质料而非政治徽记来读：红里要有酒与血的分量，白其实是香槟色的象牙，蓝则须承载启蒙理性的重力。薰衣草与橄榄金撕开南北之间的裂隙。',
    'kyoto': '一座建立在克制、雾气与余韵之上的城。丝白、樱灰、竹灰、风化的茶褐、苔绿与深靛，刻意不肯明亮；朱红是唯一被允许的一次闪耀。',
    'siamese-dream': '一场关于少年式矛盾的研究——过曝的光、失焦、低温的橙，以及有机的深绿。它最美的几个色调，也正是最不可信的那几个。'
  };

  N['zh-Hant'] = {
    'warm': '本帳簿自帶的預設配色：溫暖的紙色、深沉的書籍紅，以及兩種取自墨與靛的藍。它被設計成能長久托住大段文字，而從不提高嗓門。',
    'ouc-default': '一套圍繞學術、海洋與秩序展開的深藍體系。淡藍騰出呼吸的餘地，藏青承擔權威，港灣藍收束整體——最適合內文與表格。',
    'brunneophobia': '燒過的土、舊木、皮革，以及窯爐裡殘留的熱度。這不是明快的棕，而是煙燻過的棕；淡陶土與焦土把兩端拉開，赭橙則壓緊中段。',
    'van-dyke': '舊畫布、蒙塵的玫瑰與褪色的靛，低聲說話。玫瑰、紫、酒紅與褐灰構成一段舊油畫式的連續——文氣而安靜，不作張揚的戲劇。',
    'back-in-black': '近乎單色，卻留著塵紫的餘溫：後台的天鵝絨，化妝間鏡前的光。這份克制讓版面不與自身的結構爭搶，而粉調的底色又讓它不至於冷硬。',
    'belle-of-the-ball': '一間舊日舞廳，瓷粉、珊瑚色的燈光與遲暮的橄欖綠在吊燈下相遇。珊瑚色負責戲劇性，但重心始終落在橄欖綠上，因而不會流於甜膩。',
    'pine-tree': '明確的秋日氣質：金、赭橙、松影，以及一道晦暗的漿果色過渡，把版面變成入夜前的林地。暖色承接餘光，深色守住那份安靜。',
    'provence-blue': '它的好，在於拒絕明信片式的明亮——石牆上的霧、窗台的香草盆、薰衣草田上的黃昏。因為摻了大量灰，它冷而不硬。',
    'fresco-blue': '風化的壁畫，以及嵌進礦物表面的海氣：亮部像被石灰和灰泥稀釋過，暗部則像顏料滲進了牆裡。它的深淺階梯是全套中最清晰的。',
    'monet': '象牙白、蒙塵的珊瑚、苔綠與深青同處一種空氣之中——與其說是花，不如說是畫裡的空氣。象牙與珊瑚給出即刻的暖意，青綠則穩住層次。',
    'narcissus': '乾燥、溫暖而帶顆粒感：淺處是沙與舊布，中段走過風化的赭，深處壓進鏽色與焦雪松。暖而不甜，舊而不死。',
    'roman-empire': '石、血、權力、儀典與凱旋要同時容納其中。卡拉拉大理石是建築的底面，兩種紅把國家權力分作軍事與貴族兩個聲部，金與紫收束秩序。',
    'greece': '神廟的大理石作底，城邦藍引著視線走，金色是受控的一次閃耀。赤陶、橄欖與葡萄紫，把白色大理石套語背後的人間、農事與戲劇還了回來。',
    'kanagawa': '北齋在藍上的那場革命：普魯士藍是脊梁，和紙的暖與浪沫的白是它周圍的空氣，墨色收住整幅構圖。正是這種單色調的變奏，讓它讀起來像木刻。',
    'starry-night': '三層藍，以及黃色光線的猛烈闖入。柏樹是那株深色的植物之火，把宇宙的漩渦拉回地面；村舍的琥珀色是僅有的另一處暖調。',
    'a-thousand-li': '青綠山水中礦物層疊的做法。石青與石綠不是生硬的色塊，而是沉澱進絹裡；赭金則充當溫度的閥門。',
    'and-quiet-flows-the-don': '徹底拒絕明亮：渾濁的藍、乾血的紅、枯葦的黃，以及一種並非抽象中性、而是凍結塵土般的灰。冷從上方壓下來，土色承擔重量。',
    'cyberpunk-edgerunners': '建立在過載之上，虛空般的暗底與螢光的高音之間沒有任何緩衝。藍是唯一可信的逃逸路線；紅標記著肉身付出的代價。',
    'grand-budapest-hotel': '裹在舊歐洲童話的光裡。粉不是少女的粉，而是陳舊的玫瑰；紫是禮節、身份與位階。香草奶油、暗金與霧藍，讓這份甜點不至於翻倒。',
    'renaissance-florence': '顏色是從材料裡取出來的，而非發明出來的：青金石、金箔、燒陶、胡桃木、柏樹、象牙石膏。青金與祭壇金定下神聖的聲部，柏與胡桃又把它拉回工坊。',
    'soviet-avant-garde': '和諧、漸變與裝飾一概拒絕。每種顏色都是一句斬釘截鐵的宣告——紅行動，黑否定，灰承擔工業的重量，藍圖之藍以圖解方式思考。',
    'constantinople': '一座必須同時屬於希臘、羅馬、拜占庭、伊斯蘭與鄂圖曼的城。深藍與赭構成東西的軸，金、紫、象牙組成神聖的三角，柏綠投下漫長的歷史陰影。',
    'france': '三色旗被當作文化質料而非政治徽記來讀：紅裡要有酒與血的分量，白其實是香檳色的象牙，藍則須承載啟蒙理性的重力。薰衣草與橄欖金撕開南北之間的裂隙。',
    'kyoto': '一座建立在克制、霧氣與餘韻之上的城。絲白、櫻灰、竹灰、風化的茶褐、苔綠與深靛，刻意不肯明亮；朱紅是唯一被允許的一次閃耀。',
    'siamese-dream': '一場關於少年式矛盾的研究——過曝的光、失焦、低溫的橙，以及有機的深綠。它最美的幾個色調，也正是最不可信的那幾個。'
  };

  N.ja = {
    'warm': 'この台帳がもともと持っている既定の配色。温かい紙の色、深い書籍の赤、そして墨と藍から借りた二つの青。長い本文を支えつづけ、決して声を張らないように作られています。',
    'ouc-default': '学問と海と秩序を軸にした深い青の体系。淡い青が息をつく余白をつくり、紺が権威を担い、港の青が全体を締めます。散文と表にもっとも素直に合います。',
    'brunneophobia': '焼けた土、古い木、革、そして窯に残る熱。陽気な茶ではなく燻された茶です。淡い陶土と焦げた土が両端を引き離し、焼けた黄土が中間を締めます。',
    'van-dyke': '古いカンバス、埃をかぶった薔薇、褪せた藍が低い声で動きます。薔薇・紫・ワイン・茶灰が古い油彩のような連なりをつくり、劇的というより文学的です。',
    'back-in-black': 'ほぼ単色でありながら、埃っぽい藤色の温もりが残ります。舞台裏のビロード、楽屋の鏡の光。その抑制が誌面と組版を争わせず、粉っぽい桃色が冷たさを防ぎます。',
    'belle-of-the-ball': '古い舞踏場。磁器のような頬紅、珊瑚色の灯、遅い時刻のオリーブがシャンデリアの下で出会います。劇性は珊瑚が担いますが、重心はオリーブにあり、甘くなりすぎません。',
    'pine-tree': 'はっきりと秋の配色。金、黄土がかった橙、松の影、そして沈んだ木の実の色が、誌面を日暮れ近い林に変えます。暖色が残光を運び、深い緑が静けさを守ります。',
    'provence-blue': '絵葉書のような明るさを拒むところに良さがあります。石壁にかかる霧、窓辺のハーブ、ラベンダー畑の夕暮れ。灰が多く含まれるので、冷たくとも硬くなりません。',
    'fresco-blue': '風化した壁画と、鉱物の表面に刻まれた潮の気配。明部は石灰と漆喰で薄められたようで、暗部は顔料が壁に染み込んだように見えます。奥行きの段は全体でもっとも明快です。',
    'monet': '象牙、埃をかぶった珊瑚、苔、深い青緑がひとつの空気の中に。花というより、絵の中の空気です。象牙と珊瑚がすぐに温もりを与え、青緑が階層を保ちます。',
    'narcissus': '乾いていて温かく、粒立っています。淡い側は砂と古い布、中間は風化した黄土、暗い側は錆と焼けた杉。甘さのない温かさ、死んでいない古さです。',
    'roman-empire': '石と血、権力と儀礼と凱旋を同時に抱えます。カラーラ大理石が建築の地となり、二つの赤が国家権力を軍と貴族に分け、金と紫が秩序を閉じます。',
    'greece': '神殿の大理石を地に、市民の青が視線を導き、金は制御された一閃です。テラコッタ、オリーブ、葡萄紫が、白大理石の紋切り型の裏にある人間と農事と演劇を取り戻します。',
    'kanagawa': '北斎による青の革命。プルシアンブルーが背骨、和紙の温もりと泡の白がその周りの空気、墨が構図を閉じます。この単色の変調こそが木版に見せる理由です。',
    'starry-night': '三層の青と、黄色い光の激しい侵入。糸杉は宇宙の渦を地上へ引き戻す暗い植物の炎で、村の琥珀色だけがもうひとつの暖色です。',
    'a-thousand-li': '青緑山水の鉱物の重ね方から。石青と石緑は塊として置かれず、絹の中に沈殿しています。黄土がかった金が温度の弁として働きます。',
    'and-quiet-flows-the-don': '明るさを一切拒みます。濁った青、乾いた血の赤、枯れた葦の黄、そして抽象的な中立ではなく凍った塵のような灰。冷たさが上から押し、土色が重さを負います。',
    'cyberpunk-edgerunners': '過負荷の上に成り立ちます。虚無のような暗い地と蛍光の高音のあいだに緩衝はありません。青だけが信じられる逃走線で、赤は肉体が払う代償を記します。',
    'grand-budapest-hotel': '古いヨーロッパの童話の光にくるまれています。桃色は少女のそれではなく古びた薔薇、紫は礼節と身分。バニラクリーム、鈍い金、霧の青が全体の甘さを支えます。',
    'renaissance-florence': '色は発明されるのではなく素材から取り出されます。ラピスラズリ、金箔、焼き陶、胡桃、糸杉、象牙の下地。ラピスと祭壇の金が聖なる声部を定め、糸杉と胡桃が工房へ引き戻します。',
    'soviet-avant-garde': '調和も階調も装飾も拒みます。どの色も断言のように振る舞い、赤は行動し、黒は否定し、灰は工業の重さを担い、青写真の青は図で考えます。',
    'constantinople': 'ギリシア、ローマ、ビザンツ、イスラーム、オスマンに同時に属さねばならない都市。深い青と黄土が東西の軸を、金・紫・象牙が聖なる三角を、糸杉の緑が長い歴史の影をつくります。',
    'france': '三色旗を政治の紋章ではなく文化の素材として読みます。赤にはワインと血の重さ、白は実のところシャンパン色の象牙、青には啓蒙の理性の重力。ラベンダーとオリーブ金が南北の裂け目を開きます。',
    'kyoto': '抑制と霧と余韻の上に建つ都市。絹の白、桜鼠、竹鼠、風化した茶、苔、濃い藍は、意図して明るくなることを拒みます。朱だけが許された一閃です。',
    'siamese-dream': '思春期の矛盾についての習作。露出過多の光、甘い焦点、低い温度の橙、そして有機的な深緑。もっとも美しい色が、もっとも信用ならない色でもあります。'
  };

  N.es = {
    'warm': 'El ajuste propio del registro: papel cálido, un rojo profundo de encuadernación y dos azules tomados de la tinta y del índigo. Hecho para sostener largos tramos de texto sin levantar nunca la voz.',
    'ouc-default': 'Un azul académico organizado en torno al estudio, el mar y el orden estructural. El azul pálido abre aire, el marino sostiene la autoridad y el azul de puerto cierra el sistema: lo más natural para prosa y tablas.',
    'brunneophobia': 'Tierra cocida, madera vieja, cuero y el calor que queda en un horno. No son marrones alegres sino ahumados; la arcilla pálida y la tierra carbonizada separan los extremos mientras el ocre quemado comprime el centro.',
    'van-dyke': 'Lienzo viejo, rosa polvorienta e índigo desvaído, en voz baja. Rosa, violeta, vino y pardo gris forman un continuo de óleo antiguo: literario y sereno más que abiertamente dramático.',
    'back-in-black': 'Casi monocromo, con el calor residual de un malva polvoriento: terciopelo de bambalinas, luz de espejo de camerino. La contención evita que la página compita con su propia retícula, y el rosa polvo impide que resulte estéril.',
    'belle-of-the-ball': 'Un salón de baile antiguo donde el rubor de porcelana, la luz coral y un oliva tardío se encuentran bajo las arañas. El coral pone la teatralidad, pero el centro de gravedad sigue en el oliva, que impide el empalago.',
    'pine-tree': 'Marcadamente otoñal: oro, naranja ocre, sombra de pino y una baya apagada convierten la página en bosque tardío. Los cálidos llevan la luz que queda; los verdes profundos guardan el silencio.',
    'provence-blue': 'Su belleza está en rechazar el brillo de postal: niebla sobre muros de piedra, macetas de hierbas en el alféizar, atardecer sobre la lavanda. Lleva tanto gris dentro que es frío sin volverse duro.',
    'fresco-blue': 'Murales desgastados y aire de mar grabado en superficies minerales: luces aguadas con cal y yeso, sombras que parecen filtradas en el muro. Su escalera de profundidad es la más clara del conjunto.',
    'monet': 'Marfil, coral polvoriento, musgo y verdeazul oscuro en una misma atmósfera: menos las flores que el aire dentro del cuadro. Marfil y coral dan calidez inmediata; los verdeazules sostienen la jerarquía.',
    'narcissus': 'Seco, cálido y granulado: arena y tela vieja en el extremo pálido, ocre desgastado en el centro, herrumbre y cedro quemado en el oscuro. Cálido sin dulzura, viejo sin volverse inerte.',
    'roman-empire': 'Piedra, sangre, poder, rito y triunfo a la vez. El mármol de Carrara es el suelo arquitectónico, dos rojos parten el poder del Estado en registro militar y patricio, y el oro y el púrpura cierran el orden.',
    'greece': 'Mármol de templo con el azul cívico guiando la mirada y el oro como destello controlado. Terracota, oliva y púrpura de uva devuelven la complejidad humana, agrícola y teatral que el tópico del mármol blanco borra.',
    'kanagawa': 'La revolución del azul en Hokusai: azul de Prusia como columna, la calidez del washi y el blanco de espuma como aire alrededor, la tinta sumi cerrando la composición. Esa modulación de un solo tono es lo que la hace xilografía.',
    'starry-night': 'Tres niveles de azul y la irrupción violenta de la luz amarilla. El ciprés es la llama vegetal oscura que devuelve el remolino cósmico a la tierra; el ámbar del pueblo es la única otra nota cálida.',
    'a-thousand-li': 'La estratificación mineral de la pintura de paisaje azul-verde china. Azurita y malaquita no se posan en bloques: se sedimentan en la seda, con el oro ocre como válvula de temperatura.',
    'and-quiet-flows-the-don': 'El brillo rechazado del todo: azul turbio, rojo de sangre seca, amarillo de junco muerto y un gris que es polvo helado, no neutralidad abstracta. El frío aprieta desde arriba; la tierra carga el peso.',
    'cyberpunk-edgerunners': 'Construida sobre la sobrecarga, sin capa intermedia que amortigüe entre el fondo de vacío y los agudos fluorescentes. El azul es la única fuga creíble; el rojo marca el precio que paga el cuerpo.',
    'grand-budapest-hotel': 'Luz de cuento de la vieja Europa. El rosa es rosa envejecida, no infantil; el púrpura es etiqueta y rango. Crema de vainilla, oro apagado y azul niebla impiden que el conjunto se venga abajo.',
    'renaissance-florence': 'Color extraído de los materiales más que inventado: lapislázuli, pan de oro, barro cocido, nogal, ciprés, yeso de marfil. Lapislázuli y oro de altar fijan el registro sagrado; ciprés y nogal lo devuelven al taller.',
    'soviet-avant-garde': 'Armonía, degradado y ornamento, todos rechazados. Cada color es una declaración de canto vivo: el rojo actúa, el negro niega, el gris carga el peso industrial, el azul de plano piensa en diagramas.',
    'constantinople': 'Una ciudad que ha de pertenecer a Grecia, Roma, Bizancio, el islam y los otomanos a la vez. El azul profundo y el ocre forman el eje este-oeste, oro, púrpura y marfil el triángulo sagrado, el ciprés la larga sombra histórica.',
    'france': 'La tricolor leída como materia cultural y no como emblema político: vino y sangre en el rojo, marfil de champán en el blanco, gravedad ilustrada en el azul. Lavanda y oro oliva abren la fractura norte-sur.',
    'kyoto': 'Una ciudad levantada sobre la contención, la niebla y el eco. Blanco de seda, gris de sakura, gris de bambú, té curtido, musgo e índigo oscuro se niegan al brillo a propósito; el bermellón es el único destello permitido.',
    'siamese-dream': 'Un estudio de contradicción adolescente: luz sobreexpuesta, foco blando, naranja de baja temperatura y verde oscuro orgánico. Sus tonos más hermosos son también los menos fiables.'
  };

  N.de = {
    'warm': 'Die eigene Voreinstellung des Buches: warmes Papier, ein tiefes Buchrot und zwei Blau, geliehen von Tinte und Indigo. Gebaut, um lange Textstrecken zu tragen, ohne je die Stimme zu heben.',
    'ouc-default': 'Ein tiefes akademisches Blau, geordnet um Gelehrsamkeit, Meer und Struktur. Blasses Blau schafft Luft, Marine trägt die Autorität, Hafenblau schließt das System — die natürlichste Wahl für Fließtext und Tabellen.',
    'brunneophobia': 'Gebrannte Erde, altes Holz, Leder und die Resthitze eines Ofens. Keine fröhlichen Brauntöne, sondern geräucherte; blasser Ton und verkohlte Erde spreizen die Enden, gebrannter Ocker staucht die Mitte.',
    'van-dyke': 'Alte Leinwand, staubiges Rosé und verblasstes Indigo, mit gedämpfter Stimme. Rosé, Violett, Wein und Braungrau bilden ein Kontinuum wie in altem Öl — literarisch und still statt offen dramatisch.',
    'back-in-black': 'Beinahe monochrom, mit der Restwärme eines staubigen Malve: Samt hinter der Bühne, Spiegellicht in der Garderobe. Die Zurückhaltung lässt die Seite nicht mit ihrem eigenen Satz konkurrieren, das Puderrosa nimmt ihr das Sterile.',
    'belle-of-the-ball': 'Ein alter Ballsaal, in dem Porzellanrouge, Korallenlicht und spätes Oliv unter Lüstern zusammentreffen. Die Koralle liefert das Theater, der Schwerpunkt aber bleibt im Oliv — und damit fern jeder Süßlichkeit.',
    'pine-tree': 'Ausgesprochen herbstlich: Gold, Ockerorange, Kiefernschatten und ein gedämpfter Beerenton machen die Seite zum späten Waldstück. Die warmen Töne tragen das Restlicht, die tiefen Grün halten die Stille.',
    'provence-blue': 'Ihre Schönheit liegt in der Weigerung, Postkarte zu sein: Nebel über Steinmauern, Kräutertöpfe auf der Bank, Abend über dem Lavendel. So viel Grau steckt darin, dass sie kühl bleibt, ohne hart zu werden.',
    'fresco-blue': 'Verwitterte Wandbilder und Seeluft, in mineralische Oberflächen geätzt: Lichter wie mit Kalk und Putz verdünnt, Tiefen, als sei das Pigment in die Wand gesickert. Ihre Tiefenleiter ist die klarste im Satz.',
    'monet': 'Elfenbein, staubige Koralle, Moos und dunkles Blaugrün in einer Atmosphäre — weniger die Blumen als die Luft im Bild. Elfenbein und Koralle geben sofort Wärme, die Blaugrün halten die Hierarchie fest.',
    'narcissus': 'Trocken, warm und körnig: Sand und altes Tuch am hellen Ende, verwitterter Ocker in der Mitte, Rost und versengte Zeder im Dunkeln. Warm ohne Süße, alt ohne zu erstarren.',
    'roman-empire': 'Stein, Blut, Macht, Ritus und Triumph zugleich. Carrara-Marmor bildet den architektonischen Grund, zwei Rot teilen die Staatsmacht in ein militärisches und ein patrizisches Register, Gold und Purpur schließen die Ordnung.',
    'greece': 'Tempelmarmor, das Bürgerblau führt das Auge, das Gold ist ein kontrolliertes Aufblitzen. Terrakotta, Oliv und Traubenpurpur holen die menschliche, bäuerliche und theatralische Vielschichtigkeit hinter dem Weißmarmor-Klischee zurück.',
    'kanagawa': 'Hokusais Revolution im Blau: Preußischblau als Rückgrat, die Wärme des Washi und das Schaumweiß als Luft ringsum, Sumi-Tusche schließt die Komposition. Diese Modulation eines einzigen Tons macht daraus einen Holzschnitt.',
    'starry-night': 'Drei Stufen Blau und der gewaltsame Einbruch gelben Lichts. Die Zypresse ist die dunkle pflanzliche Flamme, die den kosmischen Wirbel zur Erde zurückzieht; das Dorfbernstein ist der einzige weitere warme Ton.',
    'a-thousand-li': 'Die mineralische Schichtung der blau-grünen chinesischen Landschaftsmalerei. Azurit und Malachit liegen nicht als Blöcke auf, sie sind in die Seide sedimentiert; Ockergold wirkt als Temperaturventil.',
    'and-quiet-flows-the-don': 'Helligkeit rundheraus verweigert: trübes Blau, das Rot getrockneten Bluts, das Gelb toten Schilfs und ein Grau, das gefrorener Staub ist statt abstrakter Neutralität. Kälte drückt von oben, die Erde trägt das Gewicht.',
    'cyberpunk-edgerunners': 'Auf Überlast gebaut, ohne Zwischenschicht zwischen dem leeren Dunkel und den fluoreszierenden Höhen. Blau ist die einzige glaubhafte Fluchtlinie; Rot markiert, was der Körper dafür zahlt.',
    'grand-budapest-hotel': 'In das Märchenlicht des alten Europa gehüllt. Das Rosa ist gealterte Rose, nicht mädchenhaft; das Violett ist Etikette und Rang. Vanillecreme, mattes Gold und Nebelblau halten das Ganze im Lot.',
    'renaissance-florence': 'Farbe wird aus Material gewonnen, nicht erfunden: Lapis, Blattgold, gebrannter Ton, Nussbaum, Zypresse, elfenbeinerner Gesso. Lapis und Altargold setzen das sakrale Register, Zypresse und Nussbaum holen es in die Werkstatt zurück.',
    'soviet-avant-garde': 'Harmonie, Verlauf und Ornament werden allesamt verweigert. Jede Farbe ist eine scharfkantige Erklärung — Rot handelt, Schwarz verneint, Grau trägt das industrielle Gewicht, Blaupausenblau denkt in Diagrammen.',
    'constantinople': 'Eine Stadt, die zugleich Griechenland, Rom, Byzanz, dem Islam und den Osmanen gehören muss. Tiefblau und Ocker bilden die Ost-West-Achse, Gold, Purpur und Elfenbein das sakrale Dreieck, Zypressengrün den langen historischen Schatten.',
    'france': 'Die Trikolore als kulturelles Material gelesen, nicht als politisches Emblem: Wein und Blut im Rot, Champagner-Elfenbein im Weiß, aufklärerische Schwere im Blau. Lavendel und Olivgold öffnen den Bruch zwischen Nord und Süd.',
    'kyoto': 'Eine Stadt, gebaut auf Zurückhaltung, Nebel und Nachklang. Seidenweiß, Sakura-Grau, Bambusgrau, verwittertes Teebraun, Moos und dunkles Indigo verweigern die Helligkeit mit Absicht; Zinnober ist das einzige erlaubte Aufleuchten.',
    'siamese-dream': 'Eine Studie über jugendlichen Widerspruch — überbelichtetes Licht, weiche Zeichnung, kaltes Orange und organisches Dunkelgrün. Die schönsten Töne sind hier zugleich die am wenigsten verlässlichen.'
  };

  N.fr = {
    'warm': 'Le réglage propre au registre : papier chaud, un rouge de reliure profond et deux bleus empruntés à l’encre et à l’indigo. Fait pour porter de longues plages de texte sans jamais hausser le ton.',
    'ouc-default': 'Un bleu académique organisé autour de l’étude, de la mer et de l’ordre. Le bleu pâle ouvre de l’air, le marine porte l’autorité, le bleu de port referme le système : le choix le plus naturel pour la prose et les tableaux.',
    'brunneophobia': 'Terre cuite, bois ancien, cuir et la chaleur qui reste dans un four. Non des bruns gais mais des bruns fumés ; l’argile pâle et la terre calcinée écartent les extrêmes tandis que l’ocre brûlé comprime le milieu.',
    'van-dyke': 'Toile ancienne, rose poussiéreuse et indigo passé, à voix basse. Rose, violet, vin et brun-gris forment un continuum de vieille huile — littéraire et calme plutôt qu’ouvertement dramatique.',
    'back-in-black': 'Presque monochrome, avec la chaleur résiduelle d’un mauve poussiéreux : velours des coulisses, lumière de miroir de loge. La retenue empêche la page de concurrencer sa propre grille, et le rose poudré lui évite la froideur.',
    'belle-of-the-ball': 'Une salle de bal d’autrefois où le fard de porcelaine, la lumière corail et un olive tardif se croisent sous les lustres. Le corail apporte le théâtre, mais le centre de gravité reste dans l’olive, ce qui écarte toute mièvrerie.',
    'pine-tree': 'Franchement automnale : or, orange ocré, ombre de pin et une baie sourde changent la page en sous-bois tardif. Les tons chauds portent la lumière qui reste ; les verts profonds gardent le silence.',
    'provence-blue': 'Sa beauté tient au refus de l’éclat de carte postale : brume sur les murs de pierre, pots d’herbes sur l’appui, soir sur la lavande. Elle contient tant de gris qu’elle reste froide sans jamais devenir dure.',
    'fresco-blue': 'Fresques érodées et air marin gravé dans la matière minérale : des clairs délayés à la chaux et au plâtre, des sombres qui semblent avoir pénétré le mur. Son échelle de profondeur est la plus nette de la série.',
    'monet': 'Ivoire, corail poussiéreux, mousse et bleu-vert sombre dans une même atmosphère — moins les fleurs que l’air à l’intérieur du tableau. Ivoire et corail donnent la chaleur immédiate, les bleus-verts tiennent la hiérarchie.',
    'narcissus': 'Sèche, chaude et granuleuse : sable et vieux tissu du côté clair, ocre érodé au milieu, rouille et cèdre brûlé du côté sombre. Chaude sans sucre, ancienne sans être inerte.',
    'roman-empire': 'Pierre, sang, pouvoir, rite et triomphe à la fois. Le marbre de Carrare fournit le sol architectural, deux rouges partagent le pouvoir d’État entre registre militaire et patricien, l’or et le pourpre referment l’ordre.',
    'greece': 'Marbre de temple, le bleu civique conduisant l’œil, l’or en éclat maîtrisé. Terre cuite, olive et pourpre de raisin rendent la complexité humaine, agricole et théâtrale que le cliché du marbre blanc efface.',
    'kanagawa': 'La révolution du bleu chez Hokusai : bleu de Prusse pour colonne, la chaleur du washi et le blanc d’écume pour air alentour, l’encre sumi refermant la composition. Cette modulation d’un seul ton fait la gravure sur bois.',
    'starry-night': 'Trois étages de bleu et l’irruption violente d’une lumière jaune. Le cyprès est la flamme végétale sombre qui ramène le tourbillon cosmique au sol ; l’ambre du village est la seule autre note chaude.',
    'a-thousand-li': 'La stratification minérale de la peinture de paysage bleu-vert chinoise. Azurite et malachite ne sont pas posées en aplats : elles sont sédimentées dans la soie, l’or ocré servant de vanne thermique.',
    'and-quiet-flows-the-don': 'L’éclat refusé tout entier : bleu trouble, rouge de sang séché, jaune de roseau mort et un gris qui est poussière gelée plutôt que neutralité abstraite. Le froid pèse d’en haut, la terre porte la charge.',
    'cyberpunk-edgerunners': 'Bâtie sur la surcharge, sans couche intermédiaire pour amortir entre le fond de vide et les aigus fluorescents. Le bleu est la seule ligne de fuite crédible ; le rouge marque ce que le corps paie.',
    'grand-budapest-hotel': 'Enveloppée dans la lumière de conte de la vieille Europe. Le rose est une rose vieillie, non enfantine ; le violet est étiquette et rang. Crème de vanille, or éteint et bleu de brume empêchent l’ensemble de verser.',
    'renaissance-florence': 'Une couleur extraite des matériaux plutôt qu’inventée : lapis, feuille d’or, argile cuite, noyer, cyprès, gesso d’ivoire. Lapis et or d’autel posent le registre sacré ; cyprès et noyer le ramènent à l’atelier.',
    'soviet-avant-garde': 'Harmonie, dégradé et ornement, tous refusés. Chaque couleur est une déclaration à arête vive — le rouge agit, le noir nie, le gris porte le poids industriel, le bleu de plan pense en schémas.',
    'constantinople': 'Une ville qui doit appartenir à la fois à la Grèce, à Rome, à Byzance, à l’islam et aux Ottomans. Bleu profond et ocre forment l’axe est-ouest, l’or, le pourpre et l’ivoire le triangle sacré, le vert cyprès la longue ombre historique.',
    'france': 'Le tricolore lu comme matière culturelle et non comme emblème : du vin et du sang dans le rouge, un ivoire de champagne pour le blanc, la gravité des Lumières dans le bleu. Lavande et or olive ouvrent la fracture nord-sud.',
    'kyoto': 'Une ville bâtie sur la retenue, la brume et la résonance. Blanc de soie, gris de sakura, gris de bambou, thé patiné, mousse et indigo sombre refusent l’éclat à dessein ; le vermillon est le seul éclat permis.',
    'siamese-dream': 'Une étude de la contradiction adolescente — lumière surexposée, mise au point douce, orange de basse température et vert sombre organique. Ses plus belles teintes sont aussi les moins fiables.'
  };

  N.la = {
    'warm': 'Ratio propria huius codicis: charta calida, ruber librarius profundus, et duo caerulea ab atramento et indico mutuata. Facta ut longa scripturae spatia sustineat neque umquam vocem tollat.',
    'ouc-default': 'Caeruleum academicum circa studia, mare et ordinem dispositum. Caeruleum pallidum spatium aperit, nauticum auctoritatem fert, portuosum systema claudit: aptissimum orationi et tabulis.',
    'brunneophobia': 'Terra cocta, lignum vetus, corium, et calor in fornace relictus. Non fusci hilares sed fumo tincti; argilla pallida et terra ambusta extrema distendunt, ochra usta medium premit.',
    'van-dyke': 'Tela vetus, rosa pulverea, indicum evanidum, voce summissa. Rosa, viola, vinum et fuscum canum continuum picturae oleariae antiquae faciunt: litteratum et quietum potius quam scaenicum.',
    'back-in-black': 'Prope unicolor, calore tamen pulvereae malvae relicto: velum post scaenam, lumen speculi in cella vestiaria. Modestia paginam cum sua structura certare vetat, rosa pulverea ne sterilis fiat.',
    'belle-of-the-ball': 'Aula saltatoria antiqua ubi rubor porcellaneus, lumen corallinum et olea sera sub lychnuchis conveniunt. Corallium scaenam praebet, sed centrum gravitatis in olea manet, ne dulcedo superet.',
    'pine-tree': 'Plane autumnalis: aurum, ochra aurantiaca, umbra pini et bacca obscura paginam in silvam seram vertunt. Colores calidi lucem reliquam ferunt; viridia profunda silentium servant.',
    'provence-blue': 'Pulchritudo eius in claritate tabellae recusanda est: nebula super muros lapideos, herbae in fenestra, vesper super lavandulam. Tantum cani inest ut frigida maneat neque dura fiat.',
    'fresco-blue': 'Picturae parietis exesae et aura maris in superficiebus mineralibus incisa: lumina calce et gypso diluta, umbrae quasi in murum imbibitae. Scala altitudinis eius omnium clarissima est.',
    'monet': 'Ebur, corallium pulvereum, muscus et glaucum obscurum in eodem aere — non tam flores quam aer intra picturam. Ebur et corallium calorem statim dant, glauca ordinem firmum tenent.',
    'narcissus': 'Sicca, calida, granosa: harena et pannus vetus in parte pallida, ochra exesa in medio, ferrugo et cedrus usta in obscura. Calida sine dulcedine, vetus sine torpore.',
    'roman-empire': 'Lapis, sanguis, potestas, ritus et triumphus simul. Marmor Carrariense solum architecturae praebet, duo rubra potestatem publicam in militarem et patriciam dividunt, aurum et purpura ordinem claudunt.',
    'greece': 'Marmor templi, caeruleum civile oculum ducens, aurum fulgor moderatus. Terra cocta, olea et purpura uvae complexitatem humanam, agrestem, scaenicam post marmoris albi locum communem reddunt.',
    'kanagawa': 'Hokusai in caeruleo res novas movet: caeruleum Borussicum spina est, calor chartae washi et albor spumae aer circum, atramentum sumi compositionem claudit. Haec unius coloris modulatio xylographiam facit.',
    'starry-night': 'Tres gradus caerulei et lucis flavae irruptio violenta. Cupressus flamma est herbacea obscura quae vorticem caelestem ad terram retrahit; sucinum vici sola altera nota calida est.',
    'a-thousand-li': 'Stratificatio mineralis picturae Sinicae caeruleo-viridis. Azuritum et malachites non ut massae imponuntur sed in sericum sidunt, auro ochraceo temperaturam moderante.',
    'and-quiet-flows-the-don': 'Claritas prorsus recusata: caeruleum turbidum, ruber sanguinis siccati, flavum harundinis mortuae, canum non neutrum sed pulvis gelatus. Frigus desuper premit, terra pondus fert.',
    'cyberpunk-edgerunners': 'Super onus nimium aedificata, sine strato medio inter fundum vacui obscurum et acumina fluorescentia. Caeruleum sola fuga credibilis est; ruber pretium corporis notat.',
    'grand-budapest-hotel': 'Luce fabulae Europae veteris involuta. Roseus rosa vetusta est, non puellaris; purpura urbanitas et gradus. Crema vanillae, aurum obtusum et caeruleum nebulae totum ne corruat sustinent.',
    'renaissance-florence': 'Color e materia haustus potius quam inventus: lapis lazuli, bractea aurea, argilla cocta, iuglans, cupressus, gypsum eburneum. Lapis et aurum altaris registrum sacrum ponunt; cupressus et iuglans ad officinam revocant.',
    'soviet-avant-garde': 'Concordia, gradatio, ornatus — omnia recusata. Quisque color declaratio acuta est: ruber agit, niger negat, canum pondus fabricae fert, caeruleum ichnographiae per schemata cogitat.',
    'constantinople': 'Urbs quae simul Graeciae, Romae, Byzantio, Islamo et Ottomanis esse debet. Caeruleum profundum et ochra axem orientis-occidentis faciunt, aurum, purpura, ebur triangulum sacrum, viride cupressi umbram historiae longam.',
    'france': 'Vexillum tricolor ut materia culturae, non ut insigne politicum, legitur: vinum et sanguis in rubro, ebur Campaniae in albo, gravitas rationis in caeruleo. Lavandula et aurum oleae fissuram septentrionis et meridiei aperiunt.',
    'kyoto': 'Urbs modestia, nebula et resonantia aedificata. Albor serici, canum florum, canum bambusae, fuscum theae exesum, muscus et indicum obscurum claritatem consulto recusant; minium unicus fulgor permissus est.',
    'siamese-dream': 'Studium contradictionis adulescentiae: lux nimis exposita, acies mollis, aurantium frigidum, viride obscurum organicum. Colores eius pulcherrimi iidem minime fidi sunt.'
  };

  window.PALETTE_NOTES = N;

  /** The note for a palette in the current language, falling back to English. */
  window.paletteNote = function (id, lang) {
    lang = lang || (window.I18n ? window.I18n.current() : 'en');
    return (N[lang] && N[lang][id]) || N.en[id] || '';
  };
})(window);
