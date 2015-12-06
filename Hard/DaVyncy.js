"use strict";
/* https://www.codeeval.com/open_challenges/77/

Da Vyncy

Challenge Description:
 
You were reading The Da Vyncy Code, the translation of a famous murder mystery novel into Python. The Code is finally revealed on the last page. You had reached the second to last page of the novel, and then you went to take a bathroom break. 

While you were in the bathroom, the Illuminati snuck into your room and shredded the last page of your book. You had 9 backup copies of the book just in case of an attack like this, but the Illuminati shredded the last page from each of the those books, too. Then they propped up a fan, aimed it at the remains, and turned it on at high-speed. 

 The last page of your book is now in tatters. 

 However, there are many text fragments floating in the air. You enlist an undergraduate student for a 'summer research project' of typing up these fragments into a file. Your mission: reassemble the last page of your book. 

 Problem Description 
 ============= 

 (adapted from a problem by Julie Zelenski) 

 Write a program that, given a set of fragments (ASCII strings), uses the following method (or a method producing identical output) to reassemble the document from which they came: 

 At each step, your program searches the collection of fragments. It should find the pair of fragments with the maximal overlap match and merge those two fragments. This operation should decrease the total number of fragments by one. If there is more than one pair of fragments with a maximal overlap, you may break the tie in an arbitrary fashion.Fragments must overlap at their start or end. For example: 
- "ABCDEF" and "DEFG" overlap with overlap length 3
- "ABCDEF" and "XYZABC" overlap with overlap length 3
- "ABCDEF" and "BCDE" overlap with overlap length 4
- "ABCDEF" and "XCDEZ" do *not* overlap (they have matching characters in the middle, but the overlap does not extend to the end of either string).

Fear not - any test inputs given to you will satisfy the property that the tie-breaking order will not change the result, as long as you only ever merge maximally-overlapping fragments. Bonus points if you can come up with an input for which this property does not hold (ie, there exists more than 1 different final reconstruction, depending on the order in which different maximal-overlap merges are performed) -- if you find such a case, submit it in the comments to your code! 

 All characters must match exactly in a sequence (case-sensitive). Assume that your undergraduate has provided you with clean data (i.e., there are no typos). 

Input sample:

Your program should accept as its first argument a path to a filename. Each line in this file represents a test case. Each line contains fragments separated by a semicolon, which your assistant has painstakingly transcribed from the shreds left by the Illuminati. You may assume that every fragment has length at least 2 and at most 1022 (excluding the trailing newline, which should *not* be considered part of the fragment). E.g. Here are two test cases. 
O draconia;conian devil! Oh la;h lame sa;saint!
m quaerat voluptatem.;pora incidunt ut labore et d;, consectetur, adipisci velit;olore magnam aliqua;idunt ut labore et dolore magn;uptatem.;i dolorem ipsum qu;iquam quaerat vol;psum quia dolor sit amet, consectetur, a;ia dolor sit amet, conse;squam est, qui do;Neque porro quisquam est, qu;aerat voluptatem.;m eius modi tem;Neque porro qui;, sed quia non numquam ei;lorem ipsum quia dolor sit amet;ctetur, adipisci velit, sed quia non numq;unt ut labore et dolore magnam aliquam qu;dipisci velit, sed quia non numqua;us modi tempora incid;Neque porro quisquam est, qui dolorem i;uam eius modi tem;pora inc;am al

Output sample:

Print out the original document, reassembled. E.g. 
O draconian devil! Oh lame saint!
Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

*/

function solve(line) {
    var fragments = line.split(";");
    var matches = findMatches(fragments);

    while (matches.length > 0) {

        // sort to use longest first
        matches.sort(function (a, b) { return b.len - a.len });

        if (matches[0].len == 0)
        {
            fragments.sort(function (a, b) { return b.length - a.length });
            return fragments[0];
        }

        // join best
        joinFragments(fragments, matches[0].index, matches[0].targetIndex, matches[0].len);

        var index = matches[0].index;

        // remove used index and targer
        matches = matches.filter(function (item) {
            return item.index != matches[0].index &&
                item.index != matches[0].targetIndex &&
                item.targetIndex != matches[0].index &&
                item.targetIndex != matches[0].targetIndex
        });

        // look for more matches for index
        for (var i = 0; i < fragments.length; i++) {
            if (i != index) {
                if (fragments[i] != "") {
                    var overlap = findLongestOverlap(fragments[index], fragments[i]);
                    if (overlap > 0) {
                        matches.push({ len: overlap, targetIndex: i, index: index });
                    }
                }
            }
        }
    }

    fragments.sort(function (a, b) { return b.length - a.length });
    return fragments[0];
}

function joinFragments(fragments, ixTo, ixFrom, length) {
    if (overlaps(fragments[ixTo], fragments[ixFrom], length)) {
        fragments[ixTo] = fragments[ixFrom] + fragments[ixTo].substr(length);
    }
    else {
        fragments[ixTo] = fragments[ixTo] + fragments[ixFrom].substr(length);
    }
    fragments[ixFrom] = "";
}

function findMatches(fragments) {
    var matches = [];
    for (var fragmentIndex = 0; fragmentIndex < fragments.length - 1; fragmentIndex++) {
        for (var index = fragmentIndex + 1; index < fragments.length; index++) {
            var overlap = findLongestOverlap(fragments[fragmentIndex], fragments[index]);
            if (overlap > 0) {
                matches.push({ len: overlap, targetIndex: index, index: fragmentIndex });
            }
        }
    }
    return matches;
}

function findLongestOverlap(item1, item2) {
    var shortest = item1.length < item2.length ? item1 : item2;

    for (var length = shortest.length; length > 0; length--) {
        if (overlaps(item1, item2, length) || overlaps(item2, item1, length)) {
            return length;
        }
    }
    return -1;
}

function overlaps(item1, item2, length) {
    return item1.substr(0, length) == item2.substr(item2.length - length)
}

describe("solve", function () {
    var simpleSample = "O draconia;conian devil! Oh la;h lame sa;saint!"
    var longSample = "m quaerat voluptatem.;pora incidunt ut labore et d;, consectetur, adipisci velit;olore magnam aliqua;idunt ut labore et dolore magn;uptatem.;i dolorem ipsum qu;iquam quaerat vol;psum quia dolor sit amet, consectetur, a;ia dolor sit amet, conse;squam est, qui do;Neque porro quisquam est, qu;aerat voluptatem.;m eius modi tem;Neque porro qui;, sed quia non numquam ei;lorem ipsum quia dolor sit amet;ctetur, adipisci velit, sed quia non numq;unt ut labore et dolore magnam aliquam qu;dipisci velit, sed quia non numqua;us modi tempora incid;Neque porro quisquam est, qui dolorem i;uam eius modi tem;pora inc;am al";


    var x1 = "  re|veals th=e source o;ual attended `by men a,;er. Arriving home unexp;n_ th}e se]cret basement /of h;is shocked #to see h|er g%rand5;d `by men a,!nd women w`h;estinely wit'ne]sses a s;sement /of he,r gr&and4fa;@ran3dfat*he~r, ten years ea; of Isaac Newton <at =Ab'b;y fr>om university, Sop]hie cl;try e:state. From h?er hid>in}g;'ng fertility rite conducted;t %/t|he cen'ter of a ;group to ?the tomb of Isaac N;wton <at =Ab'bey. During/ t|he@ fl;'ne]sses a spri'ng fertility;ely le|ads th:e group to ?the;n'ter of a ritual attended ; ten years earlier. Arriving h;=e source of|her estrangeme^n;n, So>ph/ie re|veals th;ight |to Britain, So>ph/ie;r gr&and4fat>her's country;estrangeme^nt f{rom< he;making love -to a woman @a; conducted in_ th}e se]c;lace, s-he _is shocked #to;>her's country e:state.; Sop]hie clandestinely wi;g home unexpectedly fr>om univ; a woman @at %/t|he ce;t ultimately le|ads;er hid>in}g place, s-he;^nt f{rom< her) g@ran3dfat*he~r;h|er g%rand5father making love -;ng/ t|he@ flight |to Br";

    var x2 = " m quaerat voluptatem.;pora incidunt ut labore et d;, consectetur, adipisci velit;olore magnam aliqua;idunt ut labore et dolore magn;uptatem.;i dolorem ipsum qu;iquam quaerat vol;psum quia dolor sit amet, consectetur, a;ia dolor sit amet, conse;squam est, qui do;Neque porro quisquam est, qu;aerat voluptatem.;m eius modi tem;Neque porro qui;, sed quia non numquam ei;lorem ipsum quia dolor sit amet;ctetur, adipisci velit, sed quia non numq;unt ut labore et dolore magnam aliquam qu;dipisci velit, sed quia non numqua;us modi tempora incid;Neque porro quisquam est, qui dolorem i;uam eius modi tem;pora inc;am al";

    var x3 = " ? to Fac]he^ th)at S`aun{ie&re;es_s artwork a-nd $that|;entacle Sa#uni=ere drew ;h!ie Ne@veu s|ecr(et+ly ex-p;graphe-r, So\ph!ie Ne@veu ;. A pol]ice cr>yptographe-r, So;s a/nd n/ot |devil worship;nutes ,of h@is li}fe. Da no`te ;l+eadi^ng authority in *t||h;ns ']to !Lang#do(n sh}e isSaun&i^;er>, a)<nd t|hat Fa,ch;et+ly ex-plai'ns ']to !Lang;ni=ere drew in his own; i$ncl?udes) a Fibonacci sequ;ty in *t||he subject {; t{he\ godd*ess a/nd n/ot \;|hat Fa,che thinks L!an\<g:don;L!an\<g:don i?s t$he mu'rderer;devil worship|, as Fa&che (bel;in his own blood repre;^/ere's )est`ra?nged gr'a;fe. Da no`te al,so i$ncl?udes);*, as` a c@ode. Lan@gd}o;sh}e isSaun&i^/ere's )est`;ra?nged gr'anddaughter>, a)<nd ;[ts an 'allu#sion~ t(o t{he\ godd*;s Fa&che (believe}s. A pol]ice cr;rk a-nd $that| th@e pentacle Sa#u;bonacci sequence le[f;{of g'odd{es_s artwork a;t$he mu'rderer, because \of *th;t o(ut [of or%der*, as` a c@; S`aun{ie&re wa@s a l+eadi^ng auth;he subject {of g'odd{es_s;equence le[ft o(ut [of ; fi_na#l minutes ,of h@;t dur/ing] th|e fi_na#l m;blood represen[ts an 'allu#s;de. Lan@gd}on ? to Fac]he^";

    var x4 = " %ntaining{ th)e bones ]of Ma|ry.;'s friend, Sir Leigh Tea+bing;tters spell o,ut S|oph:i;ord. L'ang|do{n a$nd Ne;yrus. )The. box co.nta3in]i; L)ang>don's friend, S;t t)=he .to@mb co%ntaining{ th;s written on papyrus. )The. b;ie}'s given name, |SOFIA.|;y on Tea}$b.ing's private;]ing cry<pt.ex con>tains clues; t'hat ? is n@ot a cup, b(ut ;ng's private plane, on wh:ich t;o{n a$nd Neveu take k\eys#to<ne ';a cup, b(ut t)=he .to;th,ey conclude t+hat da proper co; o,ut S|oph:ie}'s given ;da proper combination;y' Gr.ail. ^There, :Tea&b; k\eys#to<ne 'to L)ang>don';combination ?of letters spell o,;`ts password. L'ang|;n wh:ich th,ey conclude;ng, an expert on the{ ; trio then fl)ees# th%*e cou@nt|; |SOFIA.| Openi*ng _th%e c[ry;o.nta3in]ing cry<pt.;ng _th%e c[ryp6tex, th#ey d;ert on the{ H\oly' Gr.ail. ^Th;eigh Tea+bing, an exper;There, :Tea&bi\ng explai*ns ;*e cou@nt|ry on Tea}$b.i;]of Ma|ry. trio then fl;g explai*ns t'hat ? is n;tains clues %to i`ts passwo";

    var x5 = " , he assumes -tha{t they are;t. Bi?shop, r(ealizing th?at;emoves its contents before de;who by now knows t@hat Lan,g;ens cryptex a,nd removes its ;by Fache, |who by now ;abi$ng i|s arrested by Fache, |w; #of Te,abing.Teabi$ng i|s;s fi+nd him. When police find Si_;Lan]gdon# re`alizes is]|APPL; _to murder innoce}nt p;t they are there to k<ill h;gd'on secretly opens crypte; is]|APPLE.| Lan-gd'on secre; t@hat Lan,gd@on w*as in;s before destroyin@g it in fron;gd@on w*as inn[ocent. Bi?shop, r(;alizing th?at S\il#as has be>en us; innoce}nt people, rus; se|co`nd cry+ptex's pw=d, which; Opus Dei Center, he assumes -; has be>en used _to murder;re to k<ill him, a%nd he r;, a%nd he rushes ^out; people, rus?hes t|o help t<he;pw=d, which Lan]gdon# re`;ding in an Opus Dei Ce;g it in front #of Te,abi;o help t<he cops fi+nd him. ;lice find Si_las hiding in an Opu";

    var x6 = " e b%ox t\h%ey fi(nd :the ;hie an@d Lan\gd!on go t.o;% to decipher th>=e code, w!hic#h ; wi/th let+te?rs [tha`t w;+the> c]ryp&tex is forced o:pe;rect pas:sw_ord, unlocki:ng @the ;e Paris branch of @t>he Deposi;cki:ng @the device. I;wh(ich Sop-hie an@d Lan; escapin#g po=lice!. In th;ndrical, hand-held vault;o=lice!. In th/e safe b%ox t\h%ey ;e l~ead=s them to, a s(afe) b.; t@h,e correct pas:sw_or;ve c/oncentric, rotati(ng dials l; s(afe) b.ox at :t'he Paris br;^ed up pr(operly form t@h,e corre;<p+te$x, a cylindrical, ha;rs [tha`t when lin^ed up pr(ope;!on go t.o after| escapin#g po;ang_don rea.lize l~ead=s the;ten<ded L#'an-~gdon% to decipher ;-held vault w[ith five c/oncentr;@t>he Depository Bank of Zu;ry Bank of Zurich, wh(ich Sop-;one: a cry(<p+te$x, a c;is forced o:pen, a,n enclos; device. If |+the> c]ryp&t;he an_d L>ang_don rea.l; fi(nd :the key)st%one: a cry(<p+;ra1ndfa{ther` inten<ded L#'a;ati(ng dials labeled wi/th let+;ode, w!hic#h s?he an_d L>ang";

    var x7 = " Lan]gdon# re`alizes is]\; to use t,he Holy@ Gr'ail, wh^ich;e}nt people, rus?hes t|o help;ne a%.nd bore ch\ildren, in ord;gd)on at gunpoint +to so;ront #of Te,abing.Teabi$ng i|s ;ng|th-at Je%sus Christ ;`er to ruin |t~*he Vatican.;ted by Fache, |who by now ;es. is\ a series .of do;ns cryptex a,nd removes it;tex's pw=d, which Lan]gdon# re`a;gd@on w*as inn[ocent. Bi?shop;h he beli$eves. is\ a se; |who by now knows t@hat;ildren, in ord`er to ruin \; murder innoce}nt people;has be>en used _to murder inno;i$las #is work$ing. Tea$bing wi@;nd removes its contents before ;ve t~he se|co`nd cry+ptex's pw=d, ; th?at S\il#as has be>en use;p, r(ealizing th?at S\il#as;e%sus Christ marri]ed M+ary Ma;'on secretly opens cryptex a,;APPLE.| Lan-gd'on secret;ents before destroyin@g it in fr;ries .of documen<ts establish;ts establishing|th-at Je%s;oint +to solve t~he se|c;ent. Bi?shop, r(ealizin;e Vatican. He compels La;n@g it in front #of Te,;`alizes is]|APPLE.| L;ea$bing wi@shes' to use t,he H;i$ng i|s arrested by Fache,; He compels Lan>gd)on at gunp;ed M+ary Magdalene a%.nd b;w knows t@hat Lan,gd@on w*as i;r'ail, wh^ich he beli$eves";

    var x8 = " lin^ed up pr(operly fo;f |+the> c]ryp&tex is force;one: a cry(<p+te$x, ;he device. If |+the> c];orm t@h,e correct pas:sw_ord, ;a.lize l~ead=s them to, a s(a;five c/oncentric, rotati;r(operly form t@h,e cor;s branch of @t>he Depositor;pas:sw_ord, unlocki:ng @t;ocki:ng @the device. ;ry(<p+te$x, a cylindrical, ;tory Bank of Zurich, wh(;hie an@d Lan\gd!on go t.o after;ex is forced o:pen, a,n e;rs [tha`t when lin^ed up p;pen, a,n enclosed vial of v;| escapin#g po=lice!. In th;ice!. In th/e safe b%ox t\h;hem to, a s(afe) b.ox at :t;ng_don rea.lize l~ead=;) b.ox at :t'he Paris branch of ;urich, wh(ich Sop-hie an@d Lan\;ed vial of vinegar ruptur@es;ntric, rotati(ng dials ;so*lves t.he mes\sage,;y fi(nd :the key)st%one: a cry;lindrical, hand-held vau; go t.o after| escapin#g ;r ruptur@es a)nd disso*lves t.; wi/th let+te?rs [tha`t wh;t.he mes\sage, wh*ich w;afe b%ox t\h%ey fi(nd :the;and-held vault w[ith five c/oncent;e Depository Bank of ;ati(ng dials labeled wi/th let+t";

    var x9 = "  L!an\<g:don i?s t$he ;. A pol]ice cr>yptographe-r, ;e Ne@veu s|ecr(et+ly ex-plai'n;rship|, as Fa&che (be; al,so i$ncl?udes) a Fibonacc;e fi_na#l minutes ,of h@is li}fe;artwork a-nd $that| th@e pe; {of g'odd{es_s artwork a-nd;s a l+eadi^ng authority in *t||he; !Lang#do(n sh}e isSaun&i;e subject {of g'odd{es_;rew in his own blood repr;r*, as` a c@ode. Lan@g;s an 'allu#sion~ t(o t{he\ godd*;y in *t||he subject {of;Fac]he^ th)at S`aun{ie&re wa@s;s) a Fibonacci sequence le[ft ;t [of or%der*, as` a c;Fa&che (believe}s. A pol]ice ;c@ode. Lan@gd}on ? to ;nddaughter>, a)<nd t|hat Fa,che ;graphe-r, So|ph!ie Ne@veu s|ecr;(o t{he\ godd*ess a/nd n/ot;,of h@is li}fe. Da no`te a;un{ie&re wa@s a l+eadi^ng;h}e isSaun&i^/ere's )est`r;at| th@e pentacle Sa;y ex-plai'ns ']to !Lang#do(n;gd}on ? to Fac]he^ th)a;t|hat Fa,che thinks L!an\<g:don;. Da no`te al,so i$ncl?; i?s t$he mu'rderer, because \;a?nged gr'anddaughter>, ;uence le[ft o(ut [of or%der*;|devil worship|, as ; blood represen[ts an 'allu#sio;s a/nd n/ot |devil wo;entacle Sa#uni=ere drew in his o;re's )est`ra?nged gr'and";

    var x10 = " ^don,| wh^$ich s$he says Fa;ds t-hat her( gra1ndfa{t;a> sec,ret )pagan gr|oup. H;wh(ich Sop-hie an@d Lan\gd!;ylindrical, hand-held vaul;ipher th>=e code, w!hic#;op%hie i]s troubled b%y mem;s*he understands t-hat he;de, w!hic#h s?he an_d L>a;$'s ar/rival. Sop%hie i]s t;-~gdon% to decipher th>=e ;a s(afe) b.ox at :t'he Paris b;involveme|nt i<n a> sec,ret )p;e Depository Bank of Zurich,;ior to\ Lan<gdon$'s ar/rival.;ndfath#er,'s involveme|;:t'he Paris branch of @;?he an_d L>ang_don rea.li;bled b%y memories& of# hers gr>;( gra1ndfa{ther` inten<ded L#'a;an gr|oup. However, s*he underst;>ad erased prior to\ Lan<;cry(<p+te$x, a cylindrical,;$he says Fa$che h>ad erased ;ead=s them to, a s(afe) b;\h%ey fi(nd :the key)st%one:;on go t.o after| escapin#g; key)st%one: a cry(<p+te$;safe b%ox t\h%ey fi(n;n@d Lan\gd!on go t.o a;nd-held vault w[ith fi;en<ded L#'an-~gdon% to ;g_don rea.lize l~ead=s them ;k of Zurich, wh(ich Sop-h;o |fi!nd' La.ng^don,| wh^$ic;| escapin#g po=lice!. ;g po=lice!. In th/e safe b%ox ; of# hers gr>andfath#er,'; branch of @t>he Depository";

    var x11 = " |he cen'ter of a ritua;-to a woman @at %/t|he cen'ter o;niere.Lang|don \! th|at what ;cted in_ th}e se]cret baseme;to Britain, So>ph/ie re|veals;ity, Sop]hie clandestinely;y e:state. From h?er hid>;c:ontact with Sau#niere.Lang|;rtility rite conducted in_ th};^nt f{rom< her) g@ran3dfat*h;r estrangeme^nt f{rom< h; spri'ng fertility rite c;ing love -to a woman; of a ritual attended `by men;r>om university, Sop]h;ho a(re wearing masks a!nd;father making love -;landestinely wit'ne]sses a s; shocked #to see h|er g%ran;he,r gr&and4fat>her's coun;flees house a.n]d break;als th=e source of|her estrangem;cret basement /of he,r gr&and;ti,ng praise to? t/he go#ddes;. Arriving home unexpe;g@ran3dfat*he~r, ten years earli;ph/ie re|veals th=e sour;n years earlier. Arriving; t/he go#ddess. She flees house a; home unexpectedly fr>om univers;at>her's country e:state. F; a.n]d breaks off all c:ontact w;'ne]sses a spri'ng fer;ded `by men a,!nd women w`h;ng masks a!nd chanti,ng prais;ee h|er g%rand5father mak;From h?er hid>in}g place, s-h; place, s-he _is shocked #;ng/ t|he@ flight |to Britain;nd women w`ho a(re weari";

    var x12 = " fath#er,'s involveme|nt i<n ;, s*he understands t-;s Fa$che h>ad erased pr; them to, a s(afe) b.ox;ice!. In th/e safe b%ox t\; Lan<gdon$'s ar/rival. Sop;es& of# hers gr>andfath#er,'s ;k of Zurich, wh(ich Sop-hie an;p. However, s*he under;^don,| wh^$ich s$he says F;%ey fi(nd :the key)st%on;a> sec,ret )pagan gr|o;at her( gra1ndfa{ther`;derstands t-hat her( gra; s(afe) b.ox at :t'he Paris branc;a1ndfa{ther` inten<ded L#'an-~g;n\gd!on go t.o after| escapin#g;>ad erased prior to\ Lan<gdon$; Depository Bank of Zurich, ;pagan gr|oup. However,;an_d L>ang_don rea.lize l~ead=s ;!hic#h s?he an_d L>ang_d;s$he says Fa$che h>ad;h Sop-hie an@d Lan\gd!on go t.o;eme|nt i<n a> sec,ret );ubled b%y memories& of# hers;he Paris branch of @t>h;ch of @t>he Depository ; to decipher th>=e code;r/rival. Sop%hie i]s tr; th>=e code, w!hic#h s?h;hie i]s troubled b%y m;n<ded L#'an-~gdon% to decipher;.lize l~ead=s them to, a ;| escapin#g po=lice!. In th/;fe b%ox t\h%ey fi(nd :th";

    var x13 = "  con>tains clues %to i;sed vial of vinegar ruptur@; 'to L)ang>don's friend;p&tex is forced o:pen, a,;unlocki:ng @the device. If ;*ich w#as written on papyrus. )Th;negar ruptur@es a)nd disso*lv; device. If |+the> c];don's friend, Sir Leigh ;L'ang|do{n a$nd Neveu ta;$nd Neveu take k\eys#to<ne 'to;ed o:pen, a,n enclosed vial o;]ing cry<pt.ex con>tains cl; five c/oncentric, rotati(n; papyrus. )The. box co.nt;orrect pas:sw_ord, unlocki:ng @;)nd disso*lves t.he mes\s;lindrical, hand-held vault ; |+the> c]ryp&tex is forc;nd-held vault w[ith five c/once;ys#to<ne 'to L)ang>do;ic, rotati(ng dials label;ials labeled wi/th let;s t.he mes\sage, wh*ich w#as wr;he. box co.nta3in]ing cry<pt.;d wi/th let+te?rs [tha`t when l;ts password. L'ang|do{n ;^ed up pr(operly form;ha`t when lin^ed up pr(o;r(operly form t@h,e correct pas:; clues %to i`ts password. ";

    var x14 = " o`te al,so i$ncl?udes) a;_s artwork a-nd $that| th@e p;ing] th|e fi_na#l minutes ,o; h@is li}fe. Da no`te al,so i;hority in *t||he subj;|help\? pol=ice decode <t;e l/eft dur/ing] th|e ; summoned> t=.os|help\? po;]he^ th)at S`aun{ie&re wa@s ;'yptic mes.sa+ge Sa@uni;@gd}on ? to Fac]he^ th)at S`a;t |devil worship|, as ;as` a c@ode. Lan@gd}on ? to F;zu Fac|he_t%ells him th`;{ie&re wa@s a l+eadi^ng ;cle Sa#uni=ere drew in his own b;ci sequence le[ft o(ut [of or%d;a l+eadi^ng authority in *;n~ t(o t{he\ godd*ess a/;#l minutes ,of h@is li}fe.;\ godd*ess a/nd n/ot |devil w;sa+ge Sa@uni&ere l/eft dur/;ells him th`a{t }he w>as;blood represen[ts an 'allu#si;i$ncl?udes) a Fibonacci sequence ; Poli=ce Captain Bezu Fac|he_t;a{t }he w>as summoned> ;=ice decode <the) cr'yptic mes.sa; *t||he subject {of g'odd{e; in his own blood represe;worship|, as Fa&che (believ;he (believe}s. A pol]ice;n 'allu#sion~ t(o t{h;ut [of or%der*, as` a c@ode. L; {of g'odd{es_s artwork a-;that| th@e pentacle Sa#uni=er";

    var x15 = " . )The. box co.nta3in]ing cry<pt.;lin^ed up pr(operly form t@h; hand-held vault w[ith five;r@es a)nd disso*lves t.he mes;s labeled wi/th let+te?rs [tha`t ;e, wh*ich w#as written on papy;the> c]ryp&tex is forced o:pen, a,;ves t.he mes\sage, wh*ich w#as;%ox t\h%ey fi(nd :the key)st%on;%to i`ts password. L'an;ang|do{n a$nd Neveu take k\e;he key)st%one: a cry(<p+te; a,n enclosed vial of vinegar ;n#g po=lice!. In th/e safe b;on>tains clues %to i`ts p;]ing cry<pt.ex con>tains clues;he device. If |+the> c]ryp&te;i(ng dials labeled wi;lt w[ith five c/oncentric,;ssword. L'ang|do{n a$n;tten on papyrus. )The. box c;th/e safe b%ox t\h%ey fi;c/oncentric, rotati(ng dials l;l of vinegar ruptur@es a)nd di;e?rs [tha`t when lin^ed up pr(;erly form t@h,e correct pas:; a cry(<p+te$x, a cylindrica;_ord, unlocki:ng @the device. ;ed o:pen, a,n enclose;a cylindrical, hand-held vau;e correct pas:sw_ord, unlocki";

    var x16 = " WHMHT_p\fDZsJo;FjhEzTAYPdDEEqaB;XmgfCrBwqYfy^qlsGvs;jvjSxwcusgKqsgyjTZ;xGSJzmwq[jO[oPYdTxMW;ONW\zUKsSnTgI;WHMHT_p\fDZsJoFjh;EzTAYPdDEEqaBXm;gfCrBwqYfy^qlsGvsjv;jSxwcusgKqsgyjTZxG;SJzmwq[jO[oPYdTxMWO;NW\zUKsSnTgI;WHMHT_p\f;DZsJo;FjhEzTAYPdDEEqaB;XmgfCrBwqYfy^qlsG;vsjvjSxwcusgKqsgyjT;ZxGSJzmwq[jO[oP;YdTxMWONW\zUKsSnTgI;WHMHT_p\fDZsJoFjhEzTAYP;dDEEqaBXmgfCrBwqYfy;^qlsGvsjvjS;xwcusgKqsgyj;TZxGSJzmwq;[jO[oPYdTxMWONW\z;UKsSnTgI;WHMHT_p\fDZsJoFjhEzT;AYPdDEEqaBXmgfCrBw;qYfy^qlsGvsjvjS;xwcus;gKqsgyjTZxGSJ;zmwq[jO[o;PYdTxMWONW\zUKsS;nTgI;WHMHT_p\fDZsJ;oFjhEzTAYPdDEEqaBXmgfC;rBwqYfy^qls;GvsjvjSxwcusgKqsg;yjTZxGSJzmwq[jO[oPYd;TxMWONW\zUKs;SnTgI;WHMHT_p\fDZs;JoFjhEzTAYPdDEEqaBXmgfC;rBwq;Yfy^qlsGvsjvjSx;wcusgKqsgyjTZxGSJzm;wq[jO[oPYdTxMWONW;\zUKsSnTgI;WHMHT_p\fDZsJoFjh;EzTAYPdDEEqaBXmgfCr;BwqYfy^qlsGvsjvj;SxwcusgKqsgyjTZxGSJzmw;q[jO[oPYdT;xMWONW\zUKsSnTgI;WHMHT_p\fDZsJoFjhE;zTAYPdDEEqa;BXmgfCrBwq;Yfy^qlsGvsjvjSx;wcusgKqsgyjTZxGSJzmwq;[jO[oPYdTxMWON;W\zUKsSnTgI;WHMHT_p\fDZsJoFjhEzTAY;PdDEEqaBXmgfCrBwqYf;y^qlsGvsjvjSxw;cusgKqsgyjTZxGSJzmwq[jO[o;PYdTxMWONW;\zUKsSnTgI;WHMHT_p\fDZsJoFjhEzTA;YPdDEEqaBXmgfCr;BwqYfy^qlsGvsjv;jSxwcusgKqsgyjTZx;GSJzmwq[jO[oPYd;TxMWONW\zUKsSnTgI;WHMHT_p\fDZs;JoFjhEzTAYPdDEE;qaBXmgfCrBwqYfy;^qlsGvsjvjSxwcu;sgKqsgyjTZxGSJzmwq[j;O[oPY;dTxMWONW\zUKsSnTgI;WHMHT_p\fDZsJoFjhEz;TAYPdDEEqaBXmgfCrBwq;Yfy^ql;sGvsjvjSxwcusgKqsgyjTZxGS;Jzmwq[jO[oPYdTx;MWONW\zUKsSnTgI;WHMHT_p\fDZsJoFjh;EzTAYPdDEEqaBXmg;fCrBwqYfy^qlsG;vsjvjSxwcusgKqsgyjTZ;xGSJzmwq[jO[oPY;dTxMWONW\zU;KsSnTgI;WHMHT_p\fDZsJoFjhEzTA;YPdDEEqaBXmgf;CrBwqYfy^qlsG;vsjvjSxwcusgKqsgyjTZxG;SJzmwq[jO[oPY;dTxMWONW\zUKsSnTgI";

    var x17 = " e: th>at ultimately le|a; wit'ne]sses a spri'ng fertility;>ph/ie re|veals th=e s;basement /of he,r gr&and4f;i'ng fertility rite conducte;/ t|he@ flight |to Britain, S; e:state. From h?er hid>; unexpectedly fr>om univ; rite conducted in_ th}e se]cre;~r, ten years earlier. Arriving;b of Isaac Newton <at ; th}e se]cret basement /o;roup to ?the tomb of Isaac ;d #to see h|er g%rand5fat;om h?er hid>in}g place, s-he; Newton <at =Ab'bey. Durin;mately le|ads th:e group to ?th;he,r gr&and4fat>her's country;Britain, So>ph/ie re|veal;ier. Arriving home unexpected;b'bey. During/ t|he@ flight;-he _is shocked #to see ;y fr>om university, Sop]hi;veals th=e source of|her estr; anot}her riddle: th>at ult;place, s-he _is shoc;< her) g@ran3dfat*he~r, ten years;sity, Sop]hie clandesti;ie clandestinely wit'ne]sses;angeme^nt f{rom< her) g@ran3d;f|her estrangeme^nt f;'s country e:state. F";

    var x18 = " ve c/oncentric, rotati(ng di;cry<pt.ex con>tains clues;(ut t)=he .to@mb co%n;n the{ H\oly' Gr.ail. ^The; pas:sw_ord, unlocki:ng @the d; explai*ns t'hat ? is n@ot ;veu take k\eys#to<ne 'to L);s [tha`t when lin^ed up pr(o;e cou@nt|ry on Tea}$b.ing's pri;gar ruptur@es a)nd disso*lves t; .to@mb co%ntaining{ th)e bo;. If |+the> c]ryp&t;i:ng @the device. If |+the;ang|do{n a$nd Neveu take k\e;closed vial of vinegar ruptur@es;otati(ng dials labeled ;ing, an expert on the{ H\oly' ;.ail. ^There, :Tea&bi;w#as written on papyrus. )T; ]of Ma|ry. trio then fl)ees#;n>tains clues %to i`ts passwor; ? is n@ot a cup, b(ut t)=he .t;`ts password. L'ang|do{n a$;s labeled wi/th let+te; co.nta3in]ing cry<pt.ex con; forced o:pen, a,n e;/th let+te?rs [tha`t whe;d, Sir Leigh Tea+bing, an ex;ed up pr(operly form t@h,e; disso*lves t.he mes\sage;o<ne 'to L)ang>don's fri;.he mes\sage, wh*ich w#as writte;g>don's friend, Sir Leigh;rly form t@h,e correct pas:sw_ord,;o:pen, a,n enclosed vial o;ng{ th)e bones ]of Ma|ry.;on papyrus. )The. box co.nta3in]i;he> c]ryp&tex is forced o:;o then fl)ees# th%*e cou@nt|ry o;re, :Tea&bi\ng explai*ns ";

    var x19 = " wn as Hieros gamos or |; t[he time %the.y arriv; men a,!nd women w`ho a(re wea;a!nd chanti,ng praise to? t/;witnessed w%as a'n ancie;$ing. Tea$bing wi@shes' t;ll c:ontact with Sau#ni; with Sau#niere.Lang|don \! ;]d breaks off all c:ontact ;ended `by men a,!nd wo;is |re&vealed| to` be d; gamos or |sacred ma=rriage\;%the.y arrive at Abbey, Tea'bi!ng ; -to a woman @at %/t|he c;e h|er g%rand5father making lo;@at %/t|he cen'ter of a ri;'ter of a ritual attended `by ;ent ceremony k\nown as Hiero;ring masks a!nd chanti;e flees house a.n]d breaks ;aise to? t/he go#ddess. S; Si$las #is work$ing. Tea$bing;d| to` be da Teacher for ;! th|at what she% witnessed w%;he go#ddess. She flees house;wi@shes' to use t,he Holy@ G;er making love -to a woma; ma=rriage|. By t[he time %;y, Tea'bi!ng <is |re&veal; Teacher for wh!om Si$las #i;%as a'n ancient ceremony;ho a(re wearing masks;ng|don \! th|at what";


    it("simpleSample", function () {
        expect(solve(simpleSample)).toEqual("O draconian devil! Oh lame saint!");
    });
    it("longSample", function () {
        expect(solve(longSample)).toEqual("Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.");
    });

    it("x1", function () {
        var result = solve(x1);
        var x1r = "  re|veals th=e source of|her estrangeme^nt f{rom< her) g@ran3dfat*he~r, ten years earlier. Arriving home unexpectedly fr>om university, Sop]hie clandestinely wit'ne]sses a spri'ng fertility rite conducted in_ th}e se]cret basement /of he,r gr&and4fat>her's country e:state. From h?er hid>in}g place, s-he _is shocked #to see h|er g%rand5father making love -to a woman @at %/t|he cen'ter of a ritual attended `by men a,!nd women w`h";
        console.log("var x1r= \"" + result + "\"");
        expect(result).toEqual(x1r);
    });

    it("x2", function () {
        var result = solve(x2);
        var x2r = "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat volore magnam aliquam al";
        console.log("var x2r= \"" + result + "\"");
        expect(result).toEqual(x2r);
    });

    it("x3", function () {
        var result = solve(x3);
        var x3r = "t dur/ing] th|e fi_na#l minutes ,of h@is li}fe. Da no`te al,so i$ncl?udes) a Fibonacci sequence le[ft o(ut [of or%der*, as` a c@ode. Lan@gd}on ? to Fac]he^ th)at S`aun{ie&re wa@s a l+eadi^ng authority in *t||he subject {of g'odd{es_s artwork a-nd $that| th@e pentacle Sa#uni=ere drew in his own blood represen[ts an 'allu#sion~ t(o t{he godd*ess a/nd n/ot |devil worship|, as Fa&che (believe}s. A pol]ice cr>yptographe-r, Soph!ie Ne@veu s|ecr(et+ly ex-plai'ns ']to !Lang#do(n sh}e isSaun&i^/ere's )est`ra?nged gr'anddaughter>, a)<nd t|hat Fa,che thinks L!an<g:don i?s t$he mu'rderer, because of *th";
        console.log("var x3r= \"" + result + "\"");
        expect(result).toEqual(x3r);
    });
});






describe("joinFragments", function () {
    it("join at start", function ()
    {
        var frag = ["a", "abcdefghi", "b", "xsafabcd", "ghidsded"];
        joinFragments(frag, 1, 3, 4);
        expect(frag.length).toEqual(5);
        expect(frag[1]).toEqual("xsafabcdefghi");
    });
    
    it("join at end", function ()
    {
        var frag = ["a", "abcdefghi", "b", "xsafabcd", "ghidsded"];
        joinFragments(frag, 1, 4, 3);
        expect(frag.length).toEqual(5);
        expect(frag[1]).toEqual("abcdefghidsded");
    });
});


describe("overlaps", function () {
    it("overlaps true", function () { expect(overlaps("abcdef", "xdsabc", 3)).toEqual(true); });
    it("overlaps false", function () { expect(overlaps("abcdef", "xdsabc", 4)).toEqual(false); });
});



