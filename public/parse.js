(function () {
    var n,
        B = {}.hasOwnProperty;
    this.bcv_parser = n = (function () {
        function k() {
            var a;
            this.options = {};
            var d = k.prototype.options;
            for (a in d)
                if (B.call(d, a)) {
                    var c = d[a];
                    this.options[a] = c;
                }
            this.versification_system(this.options.versification_system);
        }

        k.prototype.s = "";
        k.prototype.entities = [];
        k.prototype.passage = null;
        k.prototype.regexps = {};
        k.prototype.options = {
            consecutive_combination_strategy: "combine",
            osis_compaction_strategy: "b",
            book_sequence_strategy: "ignore",
            invalid_sequence_strategy: "ignore",
            sequence_combination_strategy: "combine",
            punctuation_strategy: "us",
            invalid_passage_strategy: "ignore",
            non_latin_digits_strategy: "ignore",
            passage_existence_strategy: "bcv",
            zero_chapter_strategy: "error",
            zero_verse_strategy: "error",
            single_chapter_1_strategy: "chapter",
            book_alone_strategy: "ignore",
            book_range_strategy: "ignore",
            captive_end_digits_strategy: "delete",
            end_range_digits_strategy: "verse",
            include_apocrypha: !1,
            ps151_strategy: "c",
            versification_system: "default",
            case_sensitive: "none",
        };
        k.prototype.parse = function (a) {
            this.reset();
            this.s = a;
            a = this.replace_control_characters(a);
            var d = this.match_books(a);
            a = d[0];
            this.passage.books = d[1];
            this.entities = this.match_passages(a)[0];
            return this;
        };
        k.prototype.parse_with_context = function (a, d) {
            this.reset();
            var c = this.match_books(this.replace_control_characters(d));
            d = c[0];
            this.passage.books = c[1];
            d = this.match_passages(d)[1];
            this.reset();
            this.s = a;
            a = this.replace_control_characters(a);
            c = this.match_books(a);
            a = c[0];
            this.passage.books = c[1];
            this.passage.books.push({
                value: "",
                parsed: [],
                start_index: 0,
                type: "context",
                context: d,
            });
            a = "\u001f" + (this.passage.books.length - 1) + "/9\u001f" + a;
            this.entities = this.match_passages(a)[0];
            return this;
        };
        k.prototype.reset = function () {
            this.s = "";
            this.entities = [];
            if (this.passage)
                return (this.passage.books = []), (this.passage.indices = {});
            this.passage = new Ga();
            this.passage.options = this.options;
            return (this.passage.translations = this.translations);
        };
        k.prototype.set_options = function (a) {
            var d;
            for (d in a)
                if (B.call(a, d)) {
                    var c = a[d];
                    if (
                        "include_apocrypha" === d ||
                        "versification_system" === d ||
                        "case_sensitive" === d
                    )
                        this[d](c);
                    else this.options[d] = c;
                }
            return this;
        };
        k.prototype.include_apocrypha = function (a) {
            var d, c, f;
            if (null == a || (!0 !== a && !1 !== a)) return this;
            this.options.include_apocrypha = a;
            this.regexps.books = this.regexps.get_books(
                a,
                this.options.case_sensitive
            );
            var g = this.translations;
            for (f in g)
                B.call(g, f) &&
                "aliases" !== f &&
                "alternates" !== f &&
                (null == (d = this.translations[f]).chapters && (d.chapters = {}),
                null == (c = this.translations[f].chapters).Ps &&
                (c.Ps = y.shallow_clone_array(
                    this.translations["default"].chapters.Ps
                )),
                    !0 === a
                        ? ((d =
                            null != this.translations[f].chapters.Ps151
                                ? this.translations[f].chapters.Ps151[0]
                                : this.translations["default"].chapters.Ps151[0]),
                            (this.translations[f].chapters.Ps[150] = d))
                        : 151 === this.translations[f].chapters.Ps.length &&
                        this.translations[f].chapters.Ps.pop());
            return this;
        };
        k.prototype.versification_system = function (a) {
            var d, c, f;
            if (null == a || null == this.translations[a]) return this;
            if (null != this.translations.alternates["default"])
                if ("default" === a) {
                    null != this.translations.alternates["default"].order &&
                    (this.translations["default"].order = y.shallow_clone(
                        this.translations.alternates["default"].order
                    ));
                    var g = this.translations.alternates["default"].chapters;
                    for (f in g)
                        if (B.call(g, f)) {
                            var l = g[f];
                            this.translations["default"].chapters[f] =
                                y.shallow_clone_array(l);
                        }
                } else this.versification_system("default");
            null == (d = this.translations.alternates)["default"] &&
            (d["default"] = {order: null, chapters: {}});
            "default" !== a &&
            null != this.translations[a].order &&
            (null == (l = this.translations.alternates["default"]).order &&
            (l.order = y.shallow_clone(this.translations["default"].order)),
                (this.translations["default"].order = y.shallow_clone(
                    this.translations[a].order
                )));
            if ("default" !== a && null != this.translations[a].chapters)
                for (f in ((d = this.translations[a].chapters), d))
                    B.call(d, f) &&
                    ((l = d[f]),
                    null == (c = this.translations.alternates["default"].chapters)[f] &&
                    (c[f] = y.shallow_clone_array(
                        this.translations["default"].chapters[f]
                    )),
                        (this.translations["default"].chapters[f] =
                            y.shallow_clone_array(l)));
            this.options.versification_system = a;
            this.include_apocrypha(this.options.include_apocrypha);
            return this;
        };
        k.prototype.case_sensitive = function (a) {
            if (
                null == a ||
                ("none" !== a && "books" !== a) ||
                a === this.options.case_sensitive
            )
                return this;
            this.options.case_sensitive = a;
            this.regexps.books = this.regexps.get_books(
                this.options.include_apocrypha,
                a
            );
            return this;
        };
        k.prototype.translation_info = function (a) {
            var d, c;
            null == a && (a = "default");
            null != a &&
            null !=
            (null != (c = this.translations.aliases[a]) ? c.alias : void 0) &&
            (a = this.translations.aliases[a].alias);
            if (null == a || null == this.translations[a]) a = "default";
            c = this.options.versification_system;
            a !== c && this.versification_system(a);
            var f = {
                alias: a,
                books: [],
                chapters: {},
                order: y.shallow_clone(this.translations["default"].order),
            };
            var g = this.translations["default"].chapters;
            for (d in g)
                if (B.call(g, d)) {
                    var l = g[d];
                    f.chapters[d] = y.shallow_clone_array(l);
                }
            g = f.order;
            for (d in g) B.call(g, d) && ((l = g[d]), (f.books[l - 1] = d));
            a !== c && this.versification_system(c);
            return f;
        };
        k.prototype.replace_control_characters = function (a) {
            a = a.replace(this.regexps.control, " ");
            "replace" === this.options.non_latin_digits_strategy &&
            ((a = a.replace(
                /[\u0660\u06f0\u07c0\u0966\u09e6\u0a66\u0ae6\u0b660\u0c66\u0ce6\u0d66\u0e50\u0ed0\u0f20\u1040\u1090\u17e0\u1810\u1946\u19d0\u1a80\u1a90\u1b50\u1bb0\u1c40\u1c50\ua620\ua8d0\ua900\ua9d0\uaa50\uabf0\uff10]/g,
                "0"
            )),
                (a = a.replace(
                    /[\u0661\u06f1\u07c1\u0967\u09e7\u0a67\u0ae7\u0b67\u0be7\u0c67\u0ce7\u0d67\u0e51\u0ed1\u0f21\u1041\u1091\u17e1\u1811\u1947\u19d1\u1a81\u1a91\u1b51\u1bb1\u1c41\u1c51\ua621\ua8d1\ua901\ua9d1\uaa51\uabf1\uff11]/g,
                    "1"
                )),
                (a = a.replace(
                    /[\u0662\u06f2\u07c2\u0968\u09e8\u0a68\u0ae8\u0b68\u0be8\u0c68\u0ce8\u0d68\u0e52\u0ed2\u0f22\u1042\u1092\u17e2\u1812\u1948\u19d2\u1a82\u1a92\u1b52\u1bb2\u1c42\u1c52\ua622\ua8d2\ua902\ua9d2\uaa52\uabf2\uff12]/g,
                    "2"
                )),
                (a = a.replace(
                    /[\u0663\u06f3\u07c3\u0969\u09e9\u0a69\u0ae9\u0b69\u0be9\u0c69\u0ce9\u0d69\u0e53\u0ed3\u0f23\u1043\u1093\u17e3\u1813\u1949\u19d3\u1a83\u1a93\u1b53\u1bb3\u1c43\u1c53\ua623\ua8d3\ua903\ua9d3\uaa53\uabf3\uff13]/g,
                    "3"
                )),
                (a = a.replace(
                    /[\u0664\u06f4\u07c4\u096a\u09ea\u0a6a\u0aea\u0b6a\u0bea\u0c6a\u0cea\u0d6a\u0e54\u0ed4\u0f24\u1044\u1094\u17e4\u1814\u194a\u19d4\u1a84\u1a94\u1b54\u1bb4\u1c44\u1c54\ua624\ua8d4\ua904\ua9d4\uaa54\uabf4\uff14]/g,
                    "4"
                )),
                (a = a.replace(
                    /[\u0665\u06f5\u07c5\u096b\u09eb\u0a6b\u0aeb\u0b6b\u0beb\u0c6b\u0ceb\u0d6b\u0e55\u0ed5\u0f25\u1045\u1095\u17e5\u1815\u194b\u19d5\u1a85\u1a95\u1b55\u1bb5\u1c45\u1c55\ua625\ua8d5\ua905\ua9d5\uaa55\uabf5\uff15]/g,
                    "5"
                )),
                (a = a.replace(
                    /[\u0666\u06f6\u07c6\u096c\u09ec\u0a6c\u0aec\u0b6c\u0bec\u0c6c\u0cec\u0d6c\u0e56\u0ed6\u0f26\u1046\u1096\u17e6\u1816\u194c\u19d6\u1a86\u1a96\u1b56\u1bb6\u1c46\u1c56\ua626\ua8d6\ua906\ua9d6\uaa56\uabf6\uff16]/g,
                    "6"
                )),
                (a = a.replace(
                    /[\u0667\u06f7\u07c7\u096d\u09ed\u0a6d\u0aed\u0b6d\u0bed\u0c6d\u0ced\u0d6d\u0e57\u0ed7\u0f27\u1047\u1097\u17e7\u1817\u194d\u19d7\u1a87\u1a97\u1b57\u1bb7\u1c47\u1c57\ua627\ua8d7\ua907\ua9d7\uaa57\uabf7\uff17]/g,
                    "7"
                )),
                (a = a.replace(
                    /[\u0668\u06f8\u07c8\u096e\u09ee\u0a6e\u0aee\u0b6e\u0bee\u0c6e\u0cee\u0d6e\u0e58\u0ed8\u0f28\u1048\u1098\u17e8\u1818\u194e\u19d8\u1a88\u1a98\u1b58\u1bb8\u1c48\u1c58\ua628\ua8d8\ua908\ua9d8\uaa58\uabf8\uff18]/g,
                    "8"
                )),
                (a = a.replace(
                    /[\u0669\u06f9\u07c9\u096f\u09ef\u0a6f\u0aef\u0b6f\u0bef\u0c6f\u0cef\u0d6f\u0e59\u0ed9\u0f29\u1049\u1099\u17e9\u1819\u194f\u19d9\u1a89\u1a99\u1b59\u1bb9\u1c49\u1c59\ua629\ua8d9\ua909\ua9d9\uaa59\uabf9\uff19]/g,
                    "9"
                )));
            return a;
        };
        k.prototype.match_books = function (a) {
            var d;
            var c = [];
            var f = this.regexps.books;
            var g = 0;
            for (d = f.length; g < d; g++) {
                var l = f[g];
                var k = !1;
                a = a.replace(l.regexp, function (a, d, f) {
                    k = !0;
                    c.push({value: f, parsed: l.osis, type: "book"});
                    return (
                        d +
                        "\u001f" +
                        (c.length - 1) +
                        (null != l.extra ? "/" + l.extra : "") +
                        "\u001f"
                    );
                });
                if (!0 === k && /^[\s\x1f\d:.,;\-\u2013\u2014]+$/.test(a)) break;
            }
            a = a.replace(this.regexps.translations, function (a) {
                c.push({value: a, parsed: a.toLowerCase(), type: "translation"});
                return "\u001e" + (c.length - 1) + "\u001e";
            });
            return [a, this.get_book_indices(c, a)];
        };
        k.prototype.get_book_indices = function (a, d) {
            var c, f;
            var g = 0;
            for (f = /([\x1f\x1e])(\d+)(?:\/\d+)?\1/g; (c = f.exec(d));)
                (a[c[2]].start_index = c.index + g),
                    (g += a[c[2]].value.length - c[0].length);
            return a;
        };
        k.prototype.match_passages = function (a) {
            var d, c;
            var f = [];
            for (c = {}; (d = this.regexps.escaped_passage.exec(a));) {
                var g = d[0];
                var l = d[1];
                c = d[2];
                var k = l.length;
                d.index += g.length - k;
                /\s[2-9]\d\d\s*$|\s\d{4,}\s*$/.test(l) &&
                (l = l.replace(/\s+\d+\s*$/, ""));
                /[\d\x1f\x1e)]$/.test(l) || (l = this.replace_match_end(l));
                "delete" === this.options.captive_end_digits_strategy &&
                ((d = d.index + l.length),
                a.length > d &&
                /^\w/.test(a.substr(d, 1)) &&
                (l = l.replace(/[\s*]+\d+$/, "")),
                    (l = l.replace(/(\x1e[)\]]?)[\s*]*\d+$/, "$1")));
                l = l.replace(/[A-Z]+/g, function (a) {
                    return a.toLowerCase();
                });
                g = "\u001f" === l.substr(0, 1) ? 0 : l.split("\u001f")[0].length;
                d = {
                    value: oa.parse(l, {
                        punctuation_strategy: this.options.punctuation_strategy,
                    }),
                    type: "base",
                    start_index: this.passage.books[c].start_index - g,
                    match: l,
                };
                "full" === this.options.book_alone_strategy &&
                "include" === this.options.book_range_strategy &&
                "b" === d.value[0].type &&
                (1 === d.value.length ||
                    (1 < d.value.length &&
                        "translation_sequence" === d.value[1].type)) &&
                0 === g &&
                (1 === this.passage.books[c].parsed.length ||
                    (1 < this.passage.books[c].parsed.length &&
                        "translation" === this.passage.books[c].parsed[1].type)) &&
                /^[234]/.test(this.passage.books[c].parsed[0]) &&
                this.create_book_range(a, d, c);
                c = this.passage.handle_obj(d);
                d = c[0];
                c = c[1];
                f = f.concat(d);
                k = this.adjust_regexp_end(d, k, l.length);
                0 < k && (this.regexps.escaped_passage.lastIndex -= k);
            }
            return [f, c];
        };
        k.prototype.adjust_regexp_end = function (a, d, c) {
            var f = 0;
            0 < a.length
                ? (f = d - a[a.length - 1].indices[1] - 1)
                : d !== c && (f = d - c);
            return f;
        };
        k.prototype.replace_match_end = function (a) {
            var d, c;
            for (c = a.length; (d = this.regexps.match_end_split.exec(a));)
                c = d.index + d[0].length;
            c < a.length && (a = a.substr(0, c));
            return a;
        };
        k.prototype.create_book_range = function (a, d, c) {
            var f, g;
            var l = [
                k.prototype.regexps.first,
                k.prototype.regexps.second,
                k.prototype.regexps.third,
            ];
            var fa = parseInt(this.passage.books[c].parsed[0].substr(0, 1), 10);
            for (f = g = 1; 1 <= fa ? g < fa : g > fa; f = 1 <= fa ? ++g : --g) {
                var m =
                    f === fa - 1
                        ? k.prototype.regexps.range_and
                        : k.prototype.regexps.range_only;
                m = a.match(
                    RegExp(
                        "(?:^|\\W)(" + l[f - 1] + "\\s*" + m + "\\s*)\\x1f" + c + "\\x1f",
                        "i"
                    )
                );
                if (null != m) return this.add_book_range_object(d, m, f);
            }
            return !1;
        };
        k.prototype.add_book_range_object = function (a, d, c) {
            var f, g;
            var l = d[1].length;
            a.value[0] = {
                type: "b_range_pre",
                value: [
                    {
                        type: "b_pre",
                        value: c.toString(),
                        indices: [d.index, d.index + l],
                    },
                    a.value[0],
                ],
                indices: [0, a.value[0].indices[1] + l],
            };
            a.value[0].value[1].indices[0] += l;
            a.value[0].value[1].indices[1] += l;
            a.start_index -= l;
            a.match = d[1] + a.match;
            if (1 !== a.value.length) {
                var k = [];
                d = c = 1;
                for (f = a.value.length; 1 <= f ? c < f : c > f; d = 1 <= f ? ++c : --c)
                    null != a.value[d].value &&
                    (null != (null != (g = a.value[d].value[0]) ? g.indices : void 0) &&
                    ((a.value[d].value[0].indices[0] += l),
                        (a.value[d].value[0].indices[1] += l)),
                        (a.value[d].indices[0] += l),
                        k.push((a.value[d].indices[1] += l)));
                return k;
            }
        };
        k.prototype.osis = function () {
            var a;
            var d = [];
            var c = this.parsed_entities();
            var f = 0;
            for (a = c.length; f < a; f++) {
                var g = c[f];
                0 < g.osis.length && d.push(g.osis);
            }
            return d.join(",");
        };
        k.prototype.osis_and_translations = function () {
            var a;
            var d = [];
            var c = this.parsed_entities();
            var f = 0;
            for (a = c.length; f < a; f++) {
                var g = c[f];
                0 < g.osis.length && d.push([g.osis, g.translations.join(",")]);
            }
            return d;
        };
        k.prototype.osis_and_indices = function () {
            var a;
            var d = [];
            var c = this.parsed_entities();
            var f = 0;
            for (a = c.length; f < a; f++) {
                var g = c[f];
                0 < g.osis.length &&
                d.push({
                    osis: g.osis,
                    translations: g.translations,
                    indices: g.indices,
                });
            }
            return d;
        };
        k.prototype.parsed_entities = function () {
            var a, d, c, f, g;
            var l = [];
            var k = (d = 0);
            for (
                c = this.entities.length;
                0 <= c ? d < c : d > c;
                k = 0 <= c ? ++d : --d
            ) {
                var m = this.entities[k];
                m.type &&
                "translation_sequence" === m.type &&
                0 < l.length &&
                k === l[l.length - 1].entity_id + 1 &&
                (l[l.length - 1].indices[1] = m.absolute_indices[1]);
                if (
                    null != m.passages &&
                    !(
                        ("b" === m.type && "ignore" === this.options.book_alone_strategy) ||
                        ("b_range" === m.type &&
                            "ignore" === this.options.book_range_strategy) ||
                        "context" === m.type
                    )
                ) {
                    var n = [];
                    var v = null;
                    if (null != m.passages[0].translations) {
                        var t = m.passages[0].translations;
                        var u = 0;
                        for (a = t.length; u < a; u++) {
                            var z = t[u];
                            var x =
                                0 < (null != (f = z.osis) ? f.length : void 0) ? z.osis : "";
                            null == v && (v = z.alias);
                            n.push(x);
                        }
                    } else (n = [""]), (v = "default");
                    u = [];
                    t = m.passages.length;
                    a = z = 0;
                    for (g = t; 0 <= g ? z < g : z > g; a = 0 <= g ? ++z : --z) {
                        x = m.passages[a];
                        null == x.type && (x.type = m.type);
                        if (
                            !1 === x.valid.valid &&
                            ("ignore" === this.options.invalid_sequence_strategy &&
                            "sequence" === m.type &&
                            this.snap_sequence("ignore", m, u, a, t),
                            "ignore" === this.options.invalid_passage_strategy)
                        )
                            continue;
                        ("b" !== x.type && "b_range" !== x.type) ||
                        "ignore" !== this.options.book_sequence_strategy ||
                        "sequence" !== m.type
                            ? (("b_range_start" !== x.type && "range_end_b" !== x.type) ||
                            "ignore" !== this.options.book_range_strategy ||
                            this.snap_range(m, a),
                            null == x.absolute_indices &&
                            (x.absolute_indices = m.absolute_indices),
                                u.push({
                                    osis: x.valid.valid ? this.to_osis(x.start, x.end, v) : "",
                                    type: x.type,
                                    indices: x.absolute_indices,
                                    translations: n,
                                    start: x.start,
                                    end: x.end,
                                    enclosed_indices: x.enclosed_absolute_indices,
                                    entity_id: k,
                                    entities: [x],
                                }))
                            : this.snap_sequence("book", m, u, a, t);
                    }
                    if (0 !== u.length)
                        if (
                            (1 < u.length &&
                            "combine" === this.options.consecutive_combination_strategy &&
                            (u = this.combine_consecutive_passages(u, v)),
                            "separate" === this.options.sequence_combination_strategy)
                        )
                            l = l.concat(u);
                        else {
                            v = [];
                            a = u.length - 1;
                            null != u[a].enclosed_indices &&
                            0 <= u[a].enclosed_indices[1] &&
                            (m.absolute_indices[1] = u[a].enclosed_indices[1]);
                            t = 0;
                            for (a = u.length; t < a; t++)
                                (z = u[t]), 0 < z.osis.length && v.push(z.osis);
                            l.push({
                                osis: v.join(","),
                                indices: m.absolute_indices,
                                translations: n,
                                entity_id: k,
                                entities: u,
                            });
                        }
                }
            }
            return l;
        };
        k.prototype.to_osis = function (a, d, c) {
            null == d.c &&
            null == d.v &&
            a.b === d.b &&
            null == a.c &&
            null == a.v &&
            "first_chapter" === this.options.book_alone_strategy &&
            (d.c = 1);
            null == a.c && (a.c = 1);
            null == a.v && (a.v = 1);
            null == d.c &&
            (0 <= this.options.passage_existence_strategy.indexOf("c") ||
            (null != this.passage.translations[c].chapters[d.b] &&
                1 === this.passage.translations[c].chapters[d.b].length)
                ? (d.c = this.passage.translations[c].chapters[d.b].length)
                : (d.c = 999));
            null == d.v &&
            (null != this.passage.translations[c].chapters[d.b][d.c - 1] &&
            0 <= this.options.passage_existence_strategy.indexOf("v")
                ? (d.v = this.passage.translations[c].chapters[d.b][d.c - 1])
                : (d.v = 999));
            this.options.include_apocrypha &&
            "b" === this.options.ps151_strategy &&
            ((151 === a.c && "Ps" === a.b) || (151 === d.c && "Ps" === d.b)) &&
            this.fix_ps151(a, d, c);
            if (
                "b" === this.options.osis_compaction_strategy &&
                1 === a.c &&
                1 === a.v &&
                ((999 === d.c && 999 === d.v) ||
                    (d.c === this.passage.translations[c].chapters[d.b].length &&
                        0 <= this.options.passage_existence_strategy.indexOf("c") &&
                        (999 === d.v ||
                            (d.v === this.passage.translations[c].chapters[d.b][d.c - 1] &&
                                0 <= this.options.passage_existence_strategy.indexOf("v")))))
            ) {
                c = a.b;
                var f = d.b;
            } else
                2 >= this.options.osis_compaction_strategy.length &&
                1 === a.v &&
                (999 === d.v ||
                    (d.v === this.passage.translations[c].chapters[d.b][d.c - 1] &&
                        0 <= this.options.passage_existence_strategy.indexOf("v")))
                    ? ((c = a.b + "." + a.c.toString()), (f = d.b + "." + d.c.toString()))
                    : ((c = a.b + "." + a.c.toString() + "." + a.v.toString()),
                        (f = d.b + "." + d.c.toString() + "." + d.v.toString()));
            c = c === f ? c : c + "-" + f;
            null != a.extra && (c = a.extra + "," + c);
            null != d.extra && (c += "," + d.extra);
            return c;
        };
        k.prototype.fix_ps151 = function (a, d, c) {
            var f;
            "default" !== c &&
            null ==
            (null != (f = this.translations[c]) ? f.chapters.Ps151 : void 0) &&
            this.passage.promote_book_to_translation("Ps151", c);
            if (151 === a.c && "Ps" === a.b) {
                if (151 === d.c && "Ps" === d.b)
                    return (a.b = "Ps151"), (a.c = 1), (d.b = "Ps151"), (d.c = 1);
                a.extra = this.to_osis(
                    {b: "Ps151", c: 1, v: a.v},
                    {
                        b: "Ps151",
                        c: 1,
                        v: this.passage.translations[c].chapters.Ps151[0],
                    },
                    c
                );
                a.b = "Prov";
                a.c = 1;
                return (a.v = 1);
            }
            d.extra = this.to_osis(
                {b: "Ps151", c: 1, v: 1},
                {b: "Ps151", c: 1, v: d.v},
                c
            );
            d.c = 150;
            return (d.v = this.passage.translations[c].chapters.Ps[149]);
        };
        k.prototype.combine_consecutive_passages = function (a, d) {
            var c, f;
            var g = [];
            var l = {};
            var k = a.length - 1;
            var m = -1;
            var n = !1;
            for (c = f = 0; 0 <= k ? f <= k : f >= k; c = 0 <= k ? ++f : --f) {
                var v = a[c];
                if (0 < v.osis.length) {
                    var t = g.length - 1;
                    var u = !1;
                    v.enclosed_indices[0] !== m && (m = v.enclosed_indices[0]);
                    0 <= m &&
                    (c === k ||
                        a[c + 1].enclosed_indices[0] !== v.enclosed_indices[0]) &&
                    (n = u = !0);
                    this.is_verse_consecutive(l, v.start, d)
                        ? ((g[t].end = v.end),
                            (g[t].is_enclosed_last = u),
                            (g[t].indices[1] = v.indices[1]),
                            (g[t].enclosed_indices[1] = v.enclosed_indices[1]),
                            (g[t].osis = this.to_osis(g[t].start, v.end, d)))
                        : g.push(v);
                    l = {b: v.end.b, c: v.end.c, v: v.end.v};
                } else g.push(v), (l = {});
            }
            n && this.snap_enclosed_indices(g);
            return g;
        };
        k.prototype.snap_enclosed_indices = function (a) {
            var d;
            var c = 0;
            for (d = a.length; c < d; c++) {
                var f = a[c];
                null != f.is_enclosed_last &&
                (0 > f.enclosed_indices[0] &&
                f.is_enclosed_last &&
                (f.indices[1] = f.enclosed_indices[1]),
                    delete f.is_enclosed_last);
            }
            return a;
        };
        k.prototype.is_verse_consecutive = function (a, d, c) {
            if (null == a.b) return !1;
            var f =
                null != this.passage.translations[c].order
                    ? this.passage.translations[c].order
                    : this.passage.translations["default"].order;
            if (a.b === d.b)
                if (a.c === d.c) {
                    if (a.v === d.v - 1) return !0;
                } else {
                    if (
                        1 === d.v &&
                        a.c === d.c - 1 &&
                        a.v === this.passage.translations[c].chapters[a.b][a.c - 1]
                    )
                        return !0;
                }
            else if (
                1 === d.c &&
                1 === d.v &&
                f[a.b] === f[d.b] - 1 &&
                a.c === this.passage.translations[c].chapters[a.b].length &&
                a.v === this.passage.translations[c].chapters[a.b][a.c - 1]
            )
                return !0;
            return !1;
        };
        k.prototype.snap_range = function (a, d) {
            var c;
            if (
                "b_range_start" === a.type ||
                ("sequence" === a.type && "b_range_start" === a.passages[d].type)
            ) {
                var f = 1;
                var g = "end";
                var l = "b_range_start";
            } else (f = 0), (g = "start"), (l = "range_end_b");
            var k = "end" === g ? "start" : "end";
            var m = a.passages[d][k];
            for (c in m) B.call(m, c) && (a.passages[d][k][c] = a.passages[d][g][c]);
            "sequence" === a.type
                ? (d >= a.value.length && (d = a.value.length - 1),
                    (f = this.passage.pluck(l, a.value[d])),
                null != f &&
                ((f = this.snap_range(f, 0)),
                    0 === d
                        ? (a.absolute_indices[0] = f.absolute_indices[0])
                        : (a.absolute_indices[1] = f.absolute_indices[1])))
                : ((a.original_type = a.type),
                    (a.type = a.value[f].type),
                    (a.absolute_indices = [
                        a.value[f].absolute_indices[0],
                        a.value[f].absolute_indices[1],
                    ]));
            return a;
        };
        k.prototype.snap_sequence = function (a, d, c, f, g) {
            var l = d.passages[f];
            l.absolute_indices[0] === d.absolute_indices[0] &&
            f < g - 1 &&
            this.get_snap_sequence_i(d.passages, f, g) !== f
                ? ((d.absolute_indices[0] = d.passages[f + 1].absolute_indices[0]),
                    this.remove_absolute_indices(d.passages, f + 1))
                : l.absolute_indices[1] === d.absolute_indices[1] && 0 < f
                    ? (d.absolute_indices[1] =
                        0 < c.length
                            ? c[c.length - 1].indices[1]
                            : d.passages[f - 1].absolute_indices[1])
                    : "book" === a &&
                    f < g - 1 &&
                    !this.starts_with_book(d.passages[f + 1]) &&
                    (d.passages[f + 1].absolute_indices[0] = l.absolute_indices[0]);
            return d;
        };
        k.prototype.get_snap_sequence_i = function (a, d, c) {
            var f, g, l;
            for (f = g = l = d + 1; l <= c ? g < c : g > c; f = l <= c ? ++g : --g) {
                if (this.starts_with_book(a[f])) return f;
                if (a[f].valid.valid) break;
            }
            return d;
        };
        k.prototype.starts_with_book = function (a) {
            return "b" === a.type.substr(0, 1) ||
            (("range" === a.type || "ff" === a.type) &&
                "b" === a.start.type.substr(0, 1))
                ? !0
                : !1;
        };
        k.prototype.remove_absolute_indices = function (a, d) {
            var c;
            if (0 > a[d].enclosed_absolute_indices[0]) return !1;
            var f = a[d].enclosed_absolute_indices;
            var g = f[0];
            f = f[1];
            var l = a.slice(d);
            var k = 0;
            for (c = l.length; k < c; k++) {
                var m = l[k];
                if (
                    m.enclosed_absolute_indices[0] === g &&
                    m.enclosed_absolute_indices[1] === f
                )
                    m.enclosed_absolute_indices = [-1, -1];
                else break;
            }
            return !0;
        };
        return k;
    })();
    var Ga = (function () {
        function k() {
        }

        k.prototype.books = [];
        k.prototype.indices = {};
        k.prototype.options = {};
        k.prototype.translations = {};
        k.prototype.handle_array = function (a, d, c) {
            var f;
            null == d && (d = []);
            null == c && (c = {});
            var g = 0;
            for (f = a.length; g < f; g++) {
                var l = a[g];
                if (null != l) {
                    if ("stop" === l.type) break;
                    c = this.handle_obj(l, d, c);
                    d = c[0];
                    c = c[1];
                }
            }
            return [d, c];
        };
        k.prototype.handle_obj = function (a, d, c) {
            return null != a.type && null != this[a.type]
                ? this[a.type](a, d, c)
                : [d, c];
        };
        k.prototype.b = function (a, d, c) {
            var f;
            a.start_context = y.shallow_clone(c);
            a.passages = [];
            c = [];
            var g = this.books[a.value].parsed;
            var l = 0;
            for (f = g.length; l < f; l++) {
                var k = g[l];
                var m = this.validate_ref(a.start_context.translations, {b: k});
                k = {start: {b: k}, end: {b: k}, valid: m};
                0 === a.passages.length && m.valid ? a.passages.push(k) : c.push(k);
            }
            0 === a.passages.length && a.passages.push(c.shift());
            0 < c.length && (a.passages[0].alternates = c);
            null != a.start_context.translations &&
            (a.passages[0].translations = a.start_context.translations);
            null == a.absolute_indices &&
            (a.absolute_indices = this.get_absolute_indices(a.indices));
            d.push(a);
            c = {b: a.passages[0].start.b};
            null != a.start_context.translations &&
            (c.translations = a.start_context.translations);
            return [d, c];
        };
        k.prototype.b_range = function (a, d, c) {
            return this.range(a, d, c);
        };
        k.prototype.b_range_pre = function (a, d, c) {
            a.start_context = y.shallow_clone(c);
            a.passages = [];
            var f = this.pluck("b", a.value);
            c = this.b(f, [], c);
            f = c[0][0];
            c = c[1];
            null == a.absolute_indices &&
            (a.absolute_indices = this.get_absolute_indices(a.indices));
            var g = {
                b: a.value[0].value + f.passages[0].start.b.substr(1),
                type: "b",
            };
            a.passages = [
                {start: g, end: f.passages[0].end, valid: f.passages[0].valid},
            ];
            null != a.start_context.translations &&
            (a.passages[0].translations = a.start_context.translations);
            d.push(a);
            return [d, c];
        };
        k.prototype.b_range_start = function (a, d, c) {
            return this.range(a, d, c);
        };
        k.prototype.base = function (a, d, c) {
            this.indices = this.calculate_indices(a.match, a.start_index);
            return this.handle_array(a.value, d, c);
        };
        k.prototype.bc = function (a, d, c) {
            var f;
            a.start_context = y.shallow_clone(c);
            a.passages = [];
            this.reset_context(c, ["b", "c", "v"]);
            var g = this.pluck("c", a.value).value;
            var l = [];
            var k = this.books[this.pluck("b", a.value).value].parsed;
            var m = 0;
            for (f = k.length; m < f; m++) {
                var n = k[m];
                var v = "c";
                var t = this.validate_ref(a.start_context.translations, {b: n, c: g});
                var u = {start: {b: n}, end: {b: n}, valid: t};
                if (
                    t.messages.start_chapter_not_exist_in_single_chapter_book ||
                    t.messages.start_chapter_1
                )
                    (u.valid = this.validate_ref(a.start_context.translations, {
                        b: n,
                        v: g,
                    })),
                    t.messages.start_chapter_not_exist_in_single_chapter_book &&
                    (u.valid.messages.start_chapter_not_exist_in_single_chapter_book = 1),
                        (u.start.c = 1),
                        (u.end.c = 1),
                        (v = "v");
                u.start[v] = g;
                n = this.fix_start_zeroes(u.valid, u.start.c, u.start.v);
                u.start.c = n[0];
                u.start.v = n[1];
                null == u.start.v && delete u.start.v;
                u.end[v] = u.start[v];
                0 === a.passages.length && u.valid.valid
                    ? a.passages.push(u)
                    : l.push(u);
            }
            0 === a.passages.length && a.passages.push(l.shift());
            0 < l.length && (a.passages[0].alternates = l);
            null != a.start_context.translations &&
            (a.passages[0].translations = a.start_context.translations);
            null == a.absolute_indices &&
            (a.absolute_indices = this.get_absolute_indices(a.indices));
            this.set_context_from_object(c, ["b", "c", "v"], a.passages[0].start);
            d.push(a);
            return [d, c];
        };
        k.prototype.bc_title = function (a, d, c) {
            var f, g;
            a.start_context = y.shallow_clone(c);
            c = this.bc(this.pluck("bc", a.value), [], c);
            var l = c[0][0];
            c = c[1];
            if (
                "Ps" !== l.passages[0].start.b.substr(0, 2) &&
                null != l.passages[0].alternates
            ) {
                var k = (f = 0);
                for (
                    g = l.passages[0].alternates.length;
                    0 <= g ? f < g : f > g;
                    k = 0 <= g ? ++f : --f
                )
                    if ("Ps" === l.passages[0].alternates[k].start.b.substr(0, 2)) {
                        l.passages[0] = l.passages[0].alternates[k];
                        break;
                    }
            }
            if ("Ps" !== l.passages[0].start.b.substr(0, 2)) return d.push(l), [d, c];
            this.books[this.pluck("b", l.value).value].parsed = ["Ps"];
            l = this.pluck("title", a.value);
            null == l && (l = this.pluck("v", a.value));
            a.value[1] = {
                type: "v",
                value: [{type: "integer", value: 1, indices: l.indices}],
                indices: l.indices,
            };
            a.type = "bcv";
            return this.bcv(a, d, a.start_context);
        };
        k.prototype.bcv = function (a, d, c) {
            var f;
            a.start_context = y.shallow_clone(c);
            a.passages = [];
            this.reset_context(c, ["b", "c", "v"]);
            var g = this.pluck("bc", a.value);
            var l = this.pluck("c", g.value).value;
            var k = this.pluck("v", a.value).value;
            var m = [];
            var n = this.books[this.pluck("b", g.value).value].parsed;
            g = 0;
            for (f = n.length; g < f; g++) {
                var v = n[g];
                var t = this.validate_ref(a.start_context.translations, {
                    b: v,
                    c: l,
                    v: k,
                });
                k = this.fix_start_zeroes(t, l, k);
                l = k[0];
                k = k[1];
                v = {
                    start: {b: v, c: l, v: k},
                    end: {b: v, c: l, v: k},
                    valid: t,
                };
                0 === a.passages.length && t.valid ? a.passages.push(v) : m.push(v);
            }
            0 === a.passages.length && a.passages.push(m.shift());
            0 < m.length && (a.passages[0].alternates = m);
            null != a.start_context.translations &&
            (a.passages[0].translations = a.start_context.translations);
            null == a.absolute_indices &&
            (a.absolute_indices = this.get_absolute_indices(a.indices));
            this.set_context_from_object(c, ["b", "c", "v"], a.passages[0].start);
            d.push(a);
            return [d, c];
        };
        k.prototype.bv = function (a, d, c) {
            a.start_context = y.shallow_clone(c);
            var f = a.value;
            f = {
                indices: a.indices,
                value: [
                    {
                        type: "bc",
                        value: [
                            f[0],
                            {type: "c", value: [{type: "integer", value: 1}]},
                        ],
                    },
                    f[1],
                ],
            };
            c = this.bcv(f, [], c);
            f = c[0][0];
            c = c[1];
            a.passages = f.passages;
            null == a.absolute_indices &&
            (a.absolute_indices = this.get_absolute_indices(a.indices));
            d.push(a);
            return [d, c];
        };
        k.prototype.c = function (a, d, c) {
            a.start_context = y.shallow_clone(c);
            var f =
                "integer" === a.type ? a.value : this.pluck("integer", a.value).value;
            var g = this.validate_ref(a.start_context.translations, {b: c.b, c: f});
            if (!g.valid && g.messages.start_chapter_not_exist_in_single_chapter_book)
                return this.v(a, d, c);
            f = this.fix_start_zeroes(g, f)[0];
            a.passages = [
                {start: {b: c.b, c: f}, end: {b: c.b, c: f}, valid: g},
            ];
            null != a.start_context.translations &&
            (a.passages[0].translations = a.start_context.translations);
            d.push(a);
            c.c = f;
            this.reset_context(c, ["v"]);
            null == a.absolute_indices &&
            (a.absolute_indices = this.get_absolute_indices(a.indices));
            return [d, c];
        };
        k.prototype.c_psalm = function (a, d, c) {
            a.type = "bc";
            var f = parseInt(this.books[a.value].value.match(/^\d+/)[0], 10);
            a.value = [
                {type: "b", value: a.value, indices: a.indices},
                {
                    type: "c",
                    value: [{type: "integer", value: f, indices: a.indices}],
                    indices: a.indices,
                },
            ];
            return this.bc(a, d, c);
        };
        k.prototype.c_title = function (a, d, c) {
            a.start_context = y.shallow_clone(c);
            if ("Ps" !== c.b) return this.c(a.value[0], d, c);
            c = this.pluck("title", a.value);
            a.value[1] = {
                type: "v",
                value: [{type: "integer", value: 1, indices: c.indices}],
                indices: c.indices,
            };
            a.type = "cv";
            return this.cv(a, d, a.start_context);
        };
        k.prototype.cv = function (a, d, c) {
            a.start_context = y.shallow_clone(c);
            var f = this.pluck("c", a.value).value;
            var g = this.pluck("v", a.value).value;
            var l = this.validate_ref(a.start_context.translations, {
                b: c.b,
                c: f,
                v: g,
            });
            g = this.fix_start_zeroes(l, f, g);
            f = g[0];
            g = g[1];
            a.passages = [
                {
                    start: {b: c.b, c: f, v: g},
                    end: {b: c.b, c: f, v: g},
                    valid: l,
                },
            ];
            null != a.start_context.translations &&
            (a.passages[0].translations = a.start_context.translations);
            d.push(a);
            c.c = f;
            c.v = g;
            null == a.absolute_indices &&
            (a.absolute_indices = this.get_absolute_indices(a.indices));
            return [d, c];
        };
        k.prototype.cb_range = function (a, d, c) {
            a.type = "range";
            var f = a.value;
            var g = f[0];
            var l = f[1];
            f = f[2];
            a.value = [{type: "bc", value: [g, l], indices: a.indices}, f];
            f.indices[1] = a.indices[1];
            return this.range(a, d, c);
        };
        k.prototype.context = function (a, d, c) {
            var f;
            a.start_context = y.shallow_clone(c);
            a.passages = [];
            var g = this.books[a.value].context;
            for (f in g) B.call(g, f) && (c[f] = this.books[a.value].context[f]);
            d.push(a);
            return [d, c];
        };
        k.prototype.cv_psalm = function (a, d, c) {
            a.start_context = y.shallow_clone(c);
            a.type = "bcv";
            var f = a.value;
            var g = f[0];
            f = f[1];
            g = this.c_psalm(g, [], a.start_context)[0][0];
            a.value = [g, f];
            return this.bcv(a, d, c);
        };
        k.prototype.ff = function (a, d, c) {
            a.start_context = y.shallow_clone(c);
            a.value.push({type: "integer", indices: a.indices, value: 999});
            c = this.range(a, [], a.start_context);
            a = c[0][0];
            c = c[1];
            a.value[0].indices = a.value[1].indices;
            a.value[0].absolute_indices = a.value[1].absolute_indices;
            a.value.pop();
            null != a.passages[0].valid.messages.end_verse_not_exist &&
            delete a.passages[0].valid.messages.end_verse_not_exist;
            null != a.passages[0].valid.messages.end_chapter_not_exist &&
            delete a.passages[0].valid.messages.end_chapter_not_exist;
            null != a.passages[0].end.original_c &&
            delete a.passages[0].end.original_c;
            d.push(a);
            return [d, c];
        };
        k.prototype.integer_title = function (a, d, c) {
            a.start_context = y.shallow_clone(c);
            if ("Ps" !== c.b) return this.integer(a.value[0], d, c);
            a.value[0] = {
                type: "c",
                value: [a.value[0]],
                indices: [a.value[0].indices[0], a.value[0].indices[1]],
            };
            a.value[1].type = "v";
            a.value[1].original_type = "title";
            a.value[1].value = [
                {type: "integer", value: 1, indices: a.value[1].value.indices},
            ];
            a.type = "cv";
            return this.cv(a, d, a.start_context);
        };
        k.prototype.integer = function (a, d, c) {
            return null != c.v ? this.v(a, d, c) : this.c(a, d, c);
        };
        k.prototype.next_v = function (a, d, c) {
            a.start_context = y.shallow_clone(c);
            var f = this.pluck_last_recursively("integer", a.value);
            null == f && (f = {value: 1});
            a.value.push({type: "integer", indices: a.indices, value: f.value + 1});
            c = this.range(a, [], a.start_context);
            f = c[0][0];
            c = c[1];
            null != f.passages[0].valid.messages.end_verse_not_exist &&
            null == f.passages[0].valid.messages.start_verse_not_exist &&
            null == f.passages[0].valid.messages.start_chapter_not_exist &&
            null != c.c &&
            (a.value.pop(),
                a.value.push({
                    type: "cv",
                    indices: a.indices,
                    value: [
                        {
                            type: "c",
                            value: [{type: "integer", value: c.c + 1, indices: a.indices}],
                            indices: a.indices,
                        },
                        {
                            type: "v",
                            value: [{type: "integer", value: 1, indices: a.indices}],
                            indices: a.indices,
                        },
                    ],
                }),
                (a = this.range(a, [], a.start_context)),
                (f = a[0]),
                (f = f[0]),
                (c = a[1]));
            f.value[0].indices = f.value[1].indices;
            f.value[0].absolute_indices = f.value[1].absolute_indices;
            f.value.pop();
            null != f.passages[0].valid.messages.end_verse_not_exist &&
            delete f.passages[0].valid.messages.end_verse_not_exist;
            null != f.passages[0].valid.messages.end_chapter_not_exist &&
            delete f.passages[0].valid.messages.end_chapter_not_exist;
            null != f.passages[0].end.original_c &&
            delete f.passages[0].end.original_c;
            d.push(f);
            return [d, c];
        };
        k.prototype.sequence = function (a, d, c) {
            var f, g;
            a.start_context = y.shallow_clone(c);
            a.passages = [];
            var l = a.value;
            var k = 0;
            for (f = l.length; k < f; k++) {
                var m = l[k];
                c = this.handle_array(m, [], c);
                m = c[0];
                m = m[0];
                c = c[1];
                var n = m.passages;
                var v = 0;
                for (g = n.length; v < g; v++) {
                    var t = n[v];
                    null == t.type && (t.type = m.type);
                    null == t.absolute_indices &&
                    (t.absolute_indices = m.absolute_indices);
                    null != m.start_context.translations &&
                    (t.translations = m.start_context.translations);
                    t.enclosed_absolute_indices =
                        "sequence_post_enclosed" === m.type ? m.absolute_indices : [-1, -1];
                    a.passages.push(t);
                }
            }
            null == a.absolute_indices &&
            (a.absolute_indices =
                0 < a.passages.length && "sequence" === a.type
                    ? [
                        a.passages[0].absolute_indices[0],
                        a.passages[a.passages.length - 1].absolute_indices[1],
                    ]
                    : this.get_absolute_indices(a.indices));
            d.push(a);
            return [d, c];
        };
        k.prototype.sequence_post_enclosed = function (a, d, c) {
            return this.sequence(a, d, c);
        };
        k.prototype.v = function (a, d, c) {
            var f =
                "integer" === a.type ? a.value : this.pluck("integer", a.value).value;
            a.start_context = y.shallow_clone(c);
            var g = null != c.c ? c.c : 1;
            var l = this.validate_ref(a.start_context.translations, {
                b: c.b,
                c: g,
                v: f,
            });
            f = this.fix_start_zeroes(l, 0, f)[1];
            a.passages = [
                {
                    start: {b: c.b, c: g, v: f},
                    end: {b: c.b, c: g, v: f},
                    valid: l,
                },
            ];
            null != a.start_context.translations &&
            (a.passages[0].translations = a.start_context.translations);
            null == a.absolute_indices &&
            (a.absolute_indices = this.get_absolute_indices(a.indices));
            d.push(a);
            c.v = f;
            return [d, c];
        };
        k.prototype.range = function (a, d, c) {
            var f, g, l, k;
            a.start_context = y.shallow_clone(c);
            var m = a.value;
            var n = m[0];
            m = m[1];
            c = this.handle_obj(n, [], c);
            n = c[0][0];
            c = c[1];
            if (
                "v" === m.type &&
                (("bc" === n.type &&
                        (null == (f = n.passages) ||
                            null == (g = f[0]) ||
                            null == (l = g.valid) ||
                            null == (k = l.messages) ||
                            !k.start_chapter_not_exist_in_single_chapter_book)) ||
                    "c" === n.type) &&
                "verse" === this.options.end_range_digits_strategy
            )
                return (a.value[0] = n), this.range_change_integer_end(a, d);
            c = this.handle_obj(m, [], c);
            m = c[0][0];
            c = c[1];
            a.value = [n, m];
            a.indices = [n.indices[0], m.indices[1]];
            delete a.absolute_indices;
            g = {
                b: n.passages[0].start.b,
                c: n.passages[0].start.c,
                v: n.passages[0].start.v,
                type: n.type,
            };
            f = {
                b: m.passages[0].end.b,
                c: m.passages[0].end.c,
                v: m.passages[0].end.v,
                type: m.type,
            };
            m.passages[0].valid.messages.start_chapter_is_zero && (f.c = 0);
            m.passages[0].valid.messages.start_verse_is_zero && (f.v = 0);
            l = this.validate_ref(a.start_context.translations, g, f);
            if (l.valid) {
                if (
                    ((m = this.range_handle_valid(l, a, n, g, m, f, d)),
                        (n = m[0]),
                        (m = m[1]),
                        n)
                )
                    return m;
            } else return this.range_handle_invalid(l, a, n, g, m, f, d);
            null == a.absolute_indices &&
            (a.absolute_indices = this.get_absolute_indices(a.indices));
            a.passages = [{start: g, end: f, valid: l}];
            null != a.start_context.translations &&
            (a.passages[0].translations = a.start_context.translations);
            "b" === g.type
                ? (a.type = "b" === f.type ? "b_range" : "b_range_start")
                : "b" === f.type && (a.type = "range_end_b");
            d.push(a);
            return [d, c];
        };
        k.prototype.range_change_end = function (a, d, c) {
            var f = a.value[1];
            "integer" === f.type
                ? ((f.original_value = f.value), (f.value = c))
                : "v" === f.type
                    ? ((f = this.pluck("integer", f.value)),
                        (f.original_value = f.value),
                        (f.value = c))
                    : "cv" === f.type &&
                    ((f = this.pluck("c", f.value)),
                        (f.original_value = f.value),
                        (f.value = c));
            return this.handle_obj(a, d, a.start_context);
        };
        k.prototype.range_change_integer_end = function (a, d) {
            var c = a.value;
            var f = c[0];
            c = c[1];
            null == a.original_type && (a.original_type = a.type);
            null == a.original_value && (a.original_value = [f, c]);
            a.type = "integer" === f.type ? "cv" : f.type + "v";
            "integer" === f.type &&
            (a.value[0] = {type: "c", value: [f], indices: f.indices});
            "integer" === c.type &&
            (a.value[1] = {type: "v", value: [c], indices: c.indices});
            return this.handle_obj(a, d, a.start_context);
        };
        k.prototype.range_check_new_end = function (a, d, c, f) {
            var g = 0;
            var l = null;
            f.messages.end_chapter_before_start
                ? (l = "c")
                : f.messages.end_verse_before_start && (l = "v");
            null != l && (g = this.range_get_new_end_value(d, c, f, l));
            0 < g &&
            ((d = {b: c.b, c: c.c, v: c.v}),
                (d[l] = g),
                (a = this.validate_ref(a, d)),
            a.valid || (g = 0));
            return g;
        };
        k.prototype.range_end_b = function (a, d, c) {
            return this.range(a, d, c);
        };
        k.prototype.range_get_new_end_value = function (a, d, c, f) {
            var g = 0;
            if (
                ("c" === f && c.messages.end_chapter_is_zero) ||
                ("v" === f && c.messages.end_verse_is_zero)
            )
                return g;
            10 <= a[f] && 10 > d[f] && a[f] - 10 * Math.floor(a[f] / 10) < d[f]
                ? (g = d[f] + 10 * Math.floor(a[f] / 10))
                : 100 <= a[f] && 100 > d[f] && a[f] - 100 < d[f] && (g = d[f] + 100);
            return g;
        };
        k.prototype.range_handle_invalid = function (a, d, c, f, g, l, k) {
            if (
                (!1 === a.valid &&
                    (a.messages.end_chapter_before_start ||
                        a.messages.end_verse_before_start) &&
                    ("integer" === g.type || "v" === g.type)) ||
                (!1 === a.valid &&
                    a.messages.end_chapter_before_start &&
                    "cv" === g.type)
            )
                if (
                    ((a = this.range_check_new_end(
                        d.start_context.translations,
                        f,
                        l,
                        a
                    )),
                    0 < a)
                )
                    return this.range_change_end(d, k, a);
            if (
                "verse" === this.options.end_range_digits_strategy &&
                null == f.v &&
                ("integer" === g.type || "v" === g.type) &&
                ((a = "v" === g.type ? this.pluck("integer", g.value) : g.value),
                    (f = this.validate_ref(d.start_context.translations, {
                        b: f.b,
                        c: f.c,
                        v: a,
                    })),
                    f.valid)
            )
                return this.range_change_integer_end(d, k);
            null == d.original_type && (d.original_type = d.type);
            d.type = "sequence";
            c = [
                [c, g],
                [[c], [g]],
            ];
            d.original_value = c[0];
            d.value = c[1];
            return this.sequence(d, k, d.start_context);
        };
        k.prototype.range_handle_valid = function (a, d, c, f, g, l, k) {
            if (
                a.messages.end_chapter_not_exist &&
                "verse" === this.options.end_range_digits_strategy &&
                null == f.v &&
                ("integer" === g.type || "v" === g.type) &&
                0 <= this.options.passage_existence_strategy.indexOf("v") &&
                ((c = "v" === g.type ? this.pluck("integer", g.value) : g.value),
                    (c = this.validate_ref(d.start_context.translations, {
                        b: f.b,
                        c: f.c,
                        v: c,
                    })),
                    c.valid)
            )
                return [!0, this.range_change_integer_end(d, k)];
            this.range_validate(a, f, l, d);
            return [!1, null];
        };
        k.prototype.range_validate = function (a, d, c, f) {
            a.messages.end_chapter_not_exist ||
            a.messages.end_chapter_not_exist_in_single_chapter_book
                ? ((c.original_c = c.c),
                    (c.c = a.messages.end_chapter_not_exist
                        ? a.messages.end_chapter_not_exist
                        : a.messages.end_chapter_not_exist_in_single_chapter_book),
                null != c.v &&
                ((c.v = this.validate_ref(f.start_context.translations, {
                    b: c.b,
                    c: c.c,
                    v: 999,
                }).messages.end_verse_not_exist),
                    delete a.messages.end_verse_is_zero))
                : a.messages.end_verse_not_exist &&
                ((c.original_v = c.v), (c.v = a.messages.end_verse_not_exist));
            a.messages.end_verse_is_zero &&
            "allow" !== this.options.zero_verse_strategy &&
            (c.v = a.messages.end_verse_is_zero);
            a.messages.end_chapter_is_zero && (c.c = a.messages.end_chapter_is_zero);
            a = this.fix_start_zeroes(a, d.c, d.v);
            d.c = a[0];
            d.v = a[1];
            return !0;
        };
        k.prototype.translation_sequence = function (a, d, c) {
            var f;
            a.start_context = y.shallow_clone(c);
            var g = [];
            g.push({translation: this.books[a.value[0].value].parsed});
            var l = a.value[1];
            var k = 0;
            for (f = l.length; k < f; k++) {
                var m = l[k];
                m = this.books[this.pluck("translation", m).value].parsed;
                null != m && g.push({translation: m});
            }
            k = 0;
            for (f = g.length; k < f; k++)
                (l = g[k]),
                    null != this.translations.aliases[l.translation]
                        ? ((l.alias = this.translations.aliases[l.translation].alias),
                            (l.osis =
                                this.translations.aliases[l.translation].osis ||
                                l.translation.toUpperCase()))
                        : ((l.alias = "default"), (l.osis = l.translation.toUpperCase()));
            0 < d.length && (c = this.translation_sequence_apply(d, g));
            null == a.absolute_indices &&
            (a.absolute_indices = this.get_absolute_indices(a.indices));
            d.push(a);
            this.reset_context(c, ["translations"]);
            return [d, c];
        };
        k.prototype.translation_sequence_apply = function (a, d) {
            var c, f, g;
            var l = 0;
            for (
                c = f = g = a.length - 1;
                0 >= g ? 0 >= f : 0 <= f;
                c = 0 >= g ? ++f : --f
            )
                if (
                    (null != a[c].original_type && (a[c].type = a[c].original_type),
                    null != a[c].original_value && (a[c].value = a[c].original_value),
                    "translation_sequence" === a[c].type)
                ) {
                    l = c + 1;
                    break;
                }
            l < a.length
                ? ((a[l].start_context.translations = d),
                    (c = this.handle_array(a.slice(l), [], a[l].start_context)),
                    (c = c[1]))
                : (c = y.shallow_clone(a[a.length - 1].start_context));
            return c;
        };
        k.prototype.pluck = function (a, d) {
            var c;
            var f = 0;
            for (c = d.length; f < c; f++) {
                var g = d[f];
                if (null != g && null != g.type && g.type === a)
                    return "c" === a || "v" === a ? this.pluck("integer", g.value) : g;
            }
            return null;
        };
        k.prototype.pluck_last_recursively = function (a, d) {
            var c;
            for (c = d.length - 1; 0 <= c; c += -1) {
                var f = d[c];
                if (null != f && null != f.type) {
                    if (f.type === a) return this.pluck(a, [f]);
                    f = this.pluck_last_recursively(a, f.value);
                    if (null != f) return f;
                }
            }
            return null;
        };
        k.prototype.set_context_from_object = function (a, d, c) {
            var f;
            var g = [];
            var l = 0;
            for (f = d.length; l < f; l++) {
                var k = d[l];
                null != c[k] && g.push((a[k] = c[k]));
            }
            return g;
        };
        k.prototype.reset_context = function (a, d) {
            var c;
            var f = [];
            var g = 0;
            for (c = d.length; g < c; g++) {
                var l = d[g];
                f.push(delete a[l]);
            }
            return f;
        };
        k.prototype.fix_start_zeroes = function (a, d, c) {
            a.messages.start_chapter_is_zero &&
            "upgrade" === this.options.zero_chapter_strategy &&
            (d = a.messages.start_chapter_is_zero);
            a.messages.start_verse_is_zero &&
            "upgrade" === this.options.zero_verse_strategy &&
            (c = a.messages.start_verse_is_zero);
            return [d, c];
        };
        k.prototype.calculate_indices = function (a, d) {
            var c, f;
            var g = "book";
            var l = [];
            var k = 0;
            d = parseInt(d, 10);
            var m = [a];
            var n = ["\u001e", "\u001f"];
            var v = 0;
            for (c = n.length; v < c; v++) {
                var t = n[v];
                var u = [];
                var z = 0;
                for (f = m.length; z < f; z++) {
                    var x = m[z];
                    u = u.concat(x.split(t));
                }
                m = u;
            }
            z = 0;
            for (v = m.length; z < v; z++)
                (x = m[z]),
                    (g = "book" === g ? "rest" : "book"),
                    (c = x.length),
                0 !== c &&
                ("book" === g
                    ? ((x = x.replace(/\/\d+$/, "")),
                        (t = k + c),
                        0 < l.length && l[l.length - 1].index === d
                            ? (l[l.length - 1].end = t)
                            : l.push({start: k, end: t, index: d}),
                        (k += c + 2),
                        (d =
                            this.books[x].start_index + this.books[x].value.length - k),
                        l.push({start: t + 1, end: t + 1, index: d}))
                    : ((t = k + c - 1),
                        0 < l.length && l[l.length - 1].index === d
                            ? (l[l.length - 1].end = t)
                            : l.push({start: k, end: t, index: d}),
                        (k += c)));
            return l;
        };
        k.prototype.get_absolute_indices = function (a) {
            var d, c;
            var f = a[0];
            a = a[1];
            var g = (c = null);
            var l = this.indices;
            var k = 0;
            for (d = l.length; k < d; k++) {
                var m = l[k];
                null === c && m.start <= f && f <= m.end && (c = f + m.index);
                if (m.start <= a && a <= m.end) {
                    g = a + m.index + 1;
                    break;
                }
            }
            return [c, g];
        };
        k.prototype.validate_ref = function (a, d, c) {
            var f;
            (null != a && 0 < a.length) ||
            (a = [{translation: "default", osis: "", alias: "default"}]);
            var g = !1;
            var l = {};
            var k = 0;
            for (f = a.length; k < f; k++) {
                var m = a[k];
                null == m.alias && (m.alias = "default");
                if (null == m.alias)
                    null == l.translation_invalid && (l.translation_invalid = []),
                        l.translation_invalid.push(m);
                else {
                    null == this.translations.aliases[m.alias] &&
                    ((m.alias = "default"),
                    null == l.translation_unknown && (l.translation_unknown = []),
                        l.translation_unknown.push(m));
                    var n = this.validate_start_ref(m.alias, d, l)[0];
                    c && (n = this.validate_end_ref(m.alias, d, c, n, l)[0]);
                    !0 === n && (g = !0);
                }
            }
            return {valid: g, messages: l};
        };
        k.prototype.validate_start_ref = function (a, d, c) {
            var f, g;
            var l = !0;
            "default" !== a &&
            null ==
            (null != (f = this.translations[a]) ? f.chapters[d.b] : void 0) &&
            this.promote_book_to_translation(d.b, a);
            f =
                null != (null != (g = this.translations[a]) ? g.order : void 0)
                    ? a
                    : "default";
            null != d.v && (d.v = parseInt(d.v, 10));
            if (null != this.translations[f].order[d.b]) {
                null == d.c && (d.c = 1);
                d.c = parseInt(d.c, 10);
                if (isNaN(d.c)) return (c.start_chapter_not_numeric = !0), [!1, c];
                0 === d.c &&
                ((c.start_chapter_is_zero = 1),
                    "error" === this.options.zero_chapter_strategy
                        ? (l = !1)
                        : (d.c = 1));
                null != d.v &&
                0 === d.v &&
                ((c.start_verse_is_zero = 1),
                    "error" === this.options.zero_verse_strategy
                        ? (l = !1)
                        : "upgrade" === this.options.zero_verse_strategy && (d.v = 1));
                0 < d.c && null != this.translations[a].chapters[d.b][d.c - 1]
                    ? null != d.v
                        ? isNaN(d.v)
                            ? ((l = !1), (c.start_verse_not_numeric = !0))
                            : d.v > this.translations[a].chapters[d.b][d.c - 1] &&
                            0 <= this.options.passage_existence_strategy.indexOf("v") &&
                            ((l = !1),
                                (c.start_verse_not_exist =
                                    this.translations[a].chapters[d.b][d.c - 1]))
                        : 1 === d.c &&
                        "verse" === this.options.single_chapter_1_strategy &&
                        1 === this.translations[a].chapters[d.b].length &&
                        (c.start_chapter_1 = 1)
                    : 1 !== d.c && 1 === this.translations[a].chapters[d.b].length
                        ? ((l = !1), (c.start_chapter_not_exist_in_single_chapter_book = 1))
                        : 0 < d.c &&
                        0 <= this.options.passage_existence_strategy.indexOf("c") &&
                        ((l = !1),
                            (c.start_chapter_not_exist =
                                this.translations[a].chapters[d.b].length));
            } else
                null == d.b
                    ? ((l = !1), (c.start_book_not_defined = !0))
                    : (0 <= this.options.passage_existence_strategy.indexOf("b") &&
                    (l = !1),
                        (c.start_book_not_exist = !0));
            return [l, c];
        };
        k.prototype.validate_end_ref = function (a, d, c, f, g) {
            var l;
            var k =
                null != (null != (l = this.translations[a]) ? l.order : void 0)
                    ? a
                    : "default";
            null != c.c &&
            ((c.c = parseInt(c.c, 10)),
                isNaN(c.c)
                    ? ((f = !1), (g.end_chapter_not_numeric = !0))
                    : 0 === c.c &&
                    ((g.end_chapter_is_zero = 1),
                        "error" === this.options.zero_chapter_strategy
                            ? (f = !1)
                            : (c.c = 1)));
            null != c.v &&
            ((c.v = parseInt(c.v, 10)),
                isNaN(c.v)
                    ? ((f = !1), (g.end_verse_not_numeric = !0))
                    : 0 === c.v &&
                    ((g.end_verse_is_zero = 1),
                        "error" === this.options.zero_verse_strategy
                            ? (f = !1)
                            : "upgrade" === this.options.zero_verse_strategy && (c.v = 1)));
            null != this.translations[k].order[c.b]
                ? (null == c.c &&
                1 === this.translations[a].chapters[c.b].length &&
                (c.c = 1),
                null != this.translations[k].order[d.b] &&
                this.translations[k].order[d.b] > this.translations[k].order[c.b] &&
                (0 <= this.options.passage_existence_strategy.indexOf("b") &&
                (f = !1),
                    (g.end_book_before_start = !0)),
                d.b !== c.b ||
                null == c.c ||
                isNaN(c.c) ||
                (null == d.c && (d.c = 1),
                    !isNaN(parseInt(d.c, 10)) && d.c > c.c
                        ? ((f = !1), (g.end_chapter_before_start = !0))
                        : d.c !== c.c ||
                        null == c.v ||
                        isNaN(c.v) ||
                        (null == d.v && (d.v = 1),
                        !isNaN(parseInt(d.v, 10)) &&
                        d.v > c.v &&
                        ((f = !1), (g.end_verse_before_start = !0)))),
                null == c.c ||
                isNaN(c.c) ||
                null != this.translations[a].chapters[c.b][c.c - 1] ||
                (1 === this.translations[a].chapters[c.b].length
                    ? (g.end_chapter_not_exist_in_single_chapter_book = 1)
                    : 0 < c.c &&
                    0 <= this.options.passage_existence_strategy.indexOf("c") &&
                    (g.end_chapter_not_exist =
                        this.translations[a].chapters[c.b].length)),
                null == c.v ||
                isNaN(c.v) ||
                (null == c.c && (c.c = this.translations[a].chapters[c.b].length),
                c.v > this.translations[a].chapters[c.b][c.c - 1] &&
                0 <= this.options.passage_existence_strategy.indexOf("v") &&
                (g.end_verse_not_exist =
                    this.translations[a].chapters[c.b][c.c - 1])))
                : ((f = !1), (g.end_book_not_exist = !0));
            return [f, g];
        };
        k.prototype.promote_book_to_translation = function (a, d) {
            var c;
            null == (c = this.translations)[d] && (c[d] = {});
            null == (c = this.translations[d]).chapters && (c.chapters = {});
            if (null == this.translations[d].chapters[a])
                return (this.translations[d].chapters[a] = y.shallow_clone_array(
                    this.translations["default"].chapters[a]
                ));
        };
        return k;
    })();
    var y = {
        shallow_clone: function (k) {
            var a;
            if (null == k) return k;
            var d = {};
            for (a in k)
                if (B.call(k, a)) {
                    var c = k[a];
                    d[a] = c;
                }
            return d;
        },
        shallow_clone_array: function (k) {
            var a, d;
            if (null == k) return k;
            var c = [];
            var f = (a = 0);
            for (d = k.length; 0 <= d ? a <= d : a >= d; f = 0 <= d ? ++a : --a)
                "undefined" !== typeof k[f] && (c[f] = k[f]);
            return c;
        },
    };
    n.prototype.regexps.translations =
        /(?:(?:(?:E[RS]|AS|TNI|RS|KJ)V|LXX|MSG|CE[BV]|AMP|HCSB|N(?:(?:KJ|RS)V|LT|IR?V|A(?:B(?:RE)?|SB?))))\b/gi;
    n.prototype.translations = {
        aliases: {
            ceb: {alias: "ceb"},
            kjv: {alias: "kjv"},
            lxx: {alias: "nab"},
            nab: {alias: "nab"},
            nabre: {alias: "nab"},
            nas: {osis: "NASB", alias: "default"},
            nirv: {alias: "kjv"},
            niv: {alias: "kjv"},
            nkjv: {alias: "nkjv"},
            nlt: {alias: "nlt"},
            nrsv: {alias: "nrsv"},
            tniv: {alias: "kjv"},
            default: {osis: "", alias: "default"},
        },
        alternates: {},
        default: {
            order: {
                Gen: 1,
                Exod: 2,
                Lev: 3,
                Num: 4,
                Deut: 5,
                Josh: 6,
                Judg: 7,
                Ruth: 8,
                "1Sam": 9,
                "2Sam": 10,
                "1Kgs": 11,
                "2Kgs": 12,
                "1Chr": 13,
                "2Chr": 14,
                Ezra: 15,
                Neh: 16,
                Esth: 17,
                Job: 18,
                Ps: 19,
                Prov: 20,
                Eccl: 21,
                Song: 22,
                Isa: 23,
                Jer: 24,
                Lam: 25,
                Ezek: 26,
                Dan: 27,
                Hos: 28,
                Joel: 29,
                Amos: 30,
                Obad: 31,
                Jonah: 32,
                Mic: 33,
                Nah: 34,
                Hab: 35,
                Zeph: 36,
                Hag: 37,
                Zech: 38,
                Mal: 39,
                Matt: 40,
                Mark: 41,
                Luke: 42,
                John: 43,
                Acts: 44,
                Rom: 45,
                "1Cor": 46,
                "2Cor": 47,
                Gal: 48,
                Eph: 49,
                Phil: 50,
                Col: 51,
                "1Thess": 52,
                "2Thess": 53,
                "1Tim": 54,
                "2Tim": 55,
                Titus: 56,
                Phlm: 57,
                Heb: 58,
                Jas: 59,
                "1Pet": 60,
                "2Pet": 61,
                "1John": 62,
                "2John": 63,
                "3John": 64,
                Jude: 65,
                Rev: 66,
                Tob: 67,
                Jdt: 68,
                GkEsth: 69,
                Wis: 70,
                Sir: 71,
                Bar: 72,
                PrAzar: 73,
                Sus: 74,
                Bel: 75,
                SgThree: 76,
                EpJer: 77,
                "1Macc": 78,
                "2Macc": 79,
                "3Macc": 80,
                "4Macc": 81,
                "1Esd": 82,
                "2Esd": 83,
                PrMan: 84,
            },
            chapters: {
                Gen: [
                    31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27,
                    33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31,
                    29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26,
                ],
                Exod: [
                    22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16,
                    27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35,
                    35, 38, 29, 31, 43, 38,
                ],
                Lev: [
                    17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30,
                    37, 27, 24, 33, 44, 23, 55, 46, 34,
                ],
                Num: [
                    54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 50, 13,
                    32, 22, 29, 35, 41, 30, 25, 18, 65, 23, 31, 40, 16, 54, 42, 56, 29,
                    34, 13,
                ],
                Deut: [
                    46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 32, 18, 29, 23, 22, 20,
                    22, 21, 20, 23, 30, 25, 22, 19, 19, 26, 68, 29, 20, 30, 52, 29, 12,
                ],
                Josh: [
                    18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18,
                    28, 51, 9, 45, 34, 16, 33,
                ],
                Judg: [
                    36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13,
                    31, 30, 48, 25,
                ],
                Ruth: [22, 23, 18, 22],
                "1Sam": [
                    28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58,
                    30, 24, 42, 15, 23, 29, 22, 44, 25, 12, 25, 11, 31, 13,
                ],
                "2Sam": [
                    27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29,
                    33, 43, 26, 22, 51, 39, 25,
                ],
                "1Kgs": [
                    53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24,
                    46, 21, 43, 29, 53,
                ],
                "2Kgs": [
                    18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 21, 21, 25, 29, 38, 20, 41,
                    37, 37, 21, 26, 20, 37, 20, 30,
                ],
                "1Chr": [
                    54, 55, 24, 43, 26, 81, 40, 40, 44, 14, 47, 40, 14, 17, 29, 43, 27,
                    17, 19, 8, 30, 19, 32, 31, 31, 32, 34, 21, 30,
                ],
                "2Chr": [
                    17, 18, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 22, 15, 19, 14, 19,
                    34, 11, 37, 20, 12, 21, 27, 28, 23, 9, 27, 36, 27, 21, 33, 25, 33, 27,
                    23,
                ],
                Ezra: [11, 70, 13, 24, 17, 22, 28, 36, 15, 44],
                Neh: [11, 20, 32, 23, 19, 19, 73, 18, 38, 39, 36, 47, 31],
                Esth: [22, 23, 15, 17, 14, 14, 10, 17, 32, 3],
                Job: [
                    22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16,
                    21, 29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 16,
                    33, 24, 41, 30, 24, 34, 17,
                ],
                Ps: [
                    6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9,
                    13, 31, 6, 10, 22, 12, 14, 9, 11, 12, 24, 11, 22, 22, 28, 12, 40, 22,
                    13, 17, 13, 11, 5, 26, 17, 11, 9, 14, 20, 23, 19, 9, 6, 7, 23, 13, 11,
                    11, 17, 12, 8, 12, 11, 10, 13, 20, 7, 35, 36, 5, 24, 20, 28, 23, 10,
                    12, 20, 72, 13, 19, 16, 8, 18, 12, 13, 17, 7, 18, 52, 17, 16, 15, 5,
                    23, 11, 13, 12, 9, 9, 5, 8, 28, 22, 35, 45, 48, 43, 13, 31, 7, 10, 10,
                    9, 8, 18, 19, 2, 29, 176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3,
                    3, 21, 26, 9, 8, 24, 13, 10, 7, 12, 15, 21, 10, 20, 14, 9, 6,
                ],
                Prov: [
                    33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28,
                    24, 29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31,
                ],
                Eccl: [18, 26, 22, 16, 20, 12, 29, 17, 18, 20, 10, 14],
                Song: [17, 17, 11, 16, 16, 13, 13, 14],
                Isa: [
                    31, 22, 26, 6, 30, 13, 25, 22, 21, 34, 16, 6, 22, 32, 9, 14, 14, 7,
                    25, 6, 17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22,
                    38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17,
                    13, 12, 21, 14, 21, 22, 11, 12, 19, 12, 25, 24,
                ],
                Jer: [
                    19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 21, 21, 27,
                    23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22,
                    19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34,
                ],
                Lam: [22, 22, 66, 22, 22],
                Ezek: [
                    28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32,
                    14, 49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15,
                    38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35,
                ],
                Dan: [21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13],
                Hos: [11, 23, 5, 19, 15, 11, 16, 14, 17, 15, 12, 14, 16, 9],
                Joel: [20, 32, 21],
                Amos: [15, 16, 15, 13, 27, 14, 17, 14, 15],
                Obad: [21],
                Jonah: [17, 10, 10, 11],
                Mic: [16, 13, 12, 13, 15, 16, 20],
                Nah: [15, 13, 19],
                Hab: [17, 20, 19],
                Zeph: [18, 15, 20],
                Hag: [15, 23],
                Zech: [21, 13, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21],
                Mal: [14, 17, 18, 6],
                Matt: [
                    25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27,
                    35, 30, 34, 46, 46, 39, 51, 46, 75, 66, 20,
                ],
                Mark: [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20],
                Luke: [
                    80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37,
                    43, 48, 47, 38, 71, 56, 53,
                ],
                John: [
                    51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26,
                    40, 42, 31, 25,
                ],
                Acts: [
                    26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34,
                    28, 41, 38, 40, 30, 35, 27, 27, 32, 44, 31,
                ],
                Rom: [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27],
                "1Cor": [
                    31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24,
                ],
                "2Cor": [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 14],
                Gal: [24, 21, 29, 31, 26, 18],
                Eph: [23, 22, 21, 32, 33, 24],
                Phil: [30, 30, 21, 23],
                Col: [29, 23, 25, 18],
                "1Thess": [10, 20, 13, 18, 28],
                "2Thess": [12, 17, 18],
                "1Tim": [20, 15, 16, 16, 25, 21],
                "2Tim": [18, 26, 17, 22],
                Titus: [16, 15, 15],
                Phlm: [25],
                Heb: [14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25],
                Jas: [27, 26, 18, 17, 20],
                "1Pet": [25, 25, 22, 19, 14],
                "2Pet": [21, 22, 18],
                "1John": [10, 29, 24, 21, 21],
                "2John": [13],
                "3John": [15],
                Jude: [25],
                Rev: [
                    20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 17, 18, 20, 8, 21, 18, 24,
                    21, 15, 27, 21,
                ],
                Tob: [22, 14, 17, 21, 22, 18, 16, 21, 6, 13, 18, 22, 17, 15],
                Jdt: [16, 28, 10, 15, 24, 21, 32, 36, 14, 23, 23, 20, 20, 19, 14, 25],
                GkEsth: [22, 23, 15, 17, 14, 14, 10, 17, 32, 13, 12, 6, 18, 19, 16, 24],
                Wis: [
                    16, 24, 19, 20, 23, 25, 30, 21, 18, 21, 26, 27, 19, 31, 19, 29, 21,
                    25, 22,
                ],
                Sir: [
                    30, 18, 31, 31, 15, 37, 36, 19, 18, 31, 34, 18, 26, 27, 20, 30, 32,
                    33, 30, 31, 28, 27, 27, 34, 26, 29, 30, 26, 28, 25, 31, 24, 33, 31,
                    26, 31, 31, 34, 35, 30, 22, 25, 33, 23, 26, 20, 25, 25, 16, 29, 30,
                ],
                Bar: [22, 35, 37, 37, 9],
                PrAzar: [68],
                Sus: [64],
                Bel: [42],
                SgThree: [39],
                EpJer: [73],
                "1Macc": [
                    64, 70, 60, 61, 68, 63, 50, 32, 73, 89, 74, 53, 53, 49, 41, 24,
                ],
                "2Macc": [36, 32, 40, 50, 27, 31, 42, 36, 29, 38, 38, 45, 26, 46, 39],
                "3Macc": [29, 33, 30, 21, 51, 41, 23],
                "4Macc": [
                    35, 24, 21, 26, 38, 35, 23, 29, 32, 21, 27, 19, 27, 20, 32, 25, 24,
                    24,
                ],
                "1Esd": [58, 30, 24, 63, 73, 34, 15, 96, 55],
                "2Esd": [
                    40, 48, 36, 52, 56, 59, 70, 63, 47, 59, 46, 51, 58, 48, 63, 78,
                ],
                PrMan: [15],
                Ps151: [7],
            },
        },
        vulgate: {
            chapters: {
                Gen: [
                    31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27,
                    33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31,
                    29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 32, 25,
                ],
                Exod: [
                    22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16,
                    27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35,
                    35, 38, 29, 31, 43, 36,
                ],
                Lev: [
                    17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30,
                    37, 27, 24, 33, 44, 23, 55, 45, 34,
                ],
                Num: [
                    54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 34, 15, 34, 45, 41, 50, 13,
                    32, 22, 30, 35, 41, 30, 25, 18, 65, 23, 31, 39, 17, 54, 42, 56, 29,
                    34, 13,
                ],
                Josh: [
                    18, 24, 17, 25, 16, 27, 26, 35, 27, 44, 23, 24, 33, 15, 63, 10, 18,
                    28, 51, 9, 43, 34, 16, 33,
                ],
                Judg: [
                    36, 23, 31, 24, 32, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13,
                    31, 30, 48, 24,
                ],
                "1Sam": [
                    28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58,
                    30, 24, 43, 15, 23, 28, 23, 44, 25, 12, 25, 11, 31, 13,
                ],
                "1Kgs": [
                    53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24,
                    46, 21, 43, 29, 54,
                ],
                "1Chr": [
                    54, 55, 24, 43, 26, 81, 40, 40, 44, 14, 46, 40, 14, 17, 29, 43, 27,
                    17, 19, 7, 30, 19, 32, 31, 31, 32, 34, 21, 30,
                ],
                Neh: [11, 20, 31, 23, 19, 19, 73, 18, 38, 39, 36, 46, 31],
                Job: [
                    22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 23, 16,
                    21, 29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 16,
                    33, 24, 41, 35, 28, 25, 16,
                ],
                Ps: [
                    6, 13, 9, 10, 13, 11, 18, 10, 39, 8, 9, 6, 7, 5, 10, 15, 51, 15, 10,
                    14, 32, 6, 10, 22, 12, 14, 9, 11, 13, 25, 11, 22, 23, 28, 13, 40, 23,
                    14, 18, 14, 12, 5, 26, 18, 12, 10, 15, 21, 23, 21, 11, 7, 9, 24, 13,
                    12, 12, 18, 14, 9, 13, 12, 11, 14, 20, 8, 36, 37, 6, 24, 20, 28, 23,
                    11, 13, 21, 72, 13, 20, 17, 8, 19, 13, 14, 17, 7, 19, 53, 17, 16, 16,
                    5, 23, 11, 13, 12, 9, 9, 5, 8, 29, 22, 35, 45, 48, 43, 14, 31, 7, 10,
                    10, 9, 26, 9, 10, 2, 29, 176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18,
                    3, 3, 21, 26, 9, 8, 24, 14, 10, 8, 12, 15, 21, 10, 11, 9, 14, 9, 6,
                ],
                Eccl: [18, 26, 22, 17, 19, 11, 30, 17, 18, 20, 10, 14],
                Song: [16, 17, 11, 16, 17, 12, 13, 14],
                Jer: [
                    19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 21, 21, 27,
                    23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22,
                    19, 32, 20, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34,
                ],
                Ezek: [
                    28, 9, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32,
                    14, 49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15,
                    38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35,
                ],
                Dan: [21, 49, 100, 34, 31, 28, 28, 27, 27, 21, 45, 13, 65, 42],
                Hos: [11, 24, 5, 19, 15, 11, 16, 14, 17, 15, 12, 14, 15, 10],
                Amos: [15, 16, 15, 13, 27, 15, 17, 14, 14],
                Jonah: [16, 11, 10, 11],
                Mic: [16, 13, 12, 13, 14, 16, 20],
                Hag: [14, 24],
                Matt: [
                    25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 26,
                    35, 30, 34, 46, 46, 39, 51, 46, 75, 66, 20,
                ],
                Mark: [45, 28, 35, 40, 43, 56, 37, 39, 49, 52, 33, 44, 37, 72, 47, 20],
                John: [
                    51, 25, 36, 54, 47, 72, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26,
                    40, 42, 31, 25,
                ],
                Acts: [
                    26, 47, 26, 37, 42, 15, 59, 40, 43, 48, 30, 25, 52, 27, 41, 40, 34,
                    28, 40, 38, 40, 30, 35, 27, 27, 32, 44, 31,
                ],
                "2Cor": [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 13],
                Rev: [
                    20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 18, 18, 20, 8, 21, 18, 24,
                    21, 15, 27, 21,
                ],
                Tob: [25, 23, 25, 23, 28, 22, 20, 24, 12, 13, 21, 22, 23, 17],
                Jdt: [12, 18, 15, 17, 29, 21, 25, 34, 19, 20, 21, 20, 31, 18, 15, 31],
                Wis: [
                    16, 25, 19, 20, 24, 27, 30, 21, 19, 21, 27, 27, 19, 31, 19, 29, 20,
                    25, 20,
                ],
                Sir: [
                    40, 23, 34, 36, 18, 37, 40, 22, 25, 34, 36, 19, 32, 27, 22, 31, 31,
                    33, 28, 33, 31, 33, 38, 47, 36, 28, 33, 30, 35, 27, 42, 28, 33, 31,
                    26, 28, 34, 39, 41, 32, 28, 26, 37, 27, 31, 23, 31, 28, 19, 31, 38,
                    13,
                ],
                Bar: [22, 35, 38, 37, 9, 72],
                "1Macc": [
                    67, 70, 60, 61, 68, 63, 50, 32, 73, 89, 74, 54, 54, 49, 41, 24,
                ],
                "2Macc": [36, 33, 40, 50, 27, 31, 42, 36, 29, 38, 38, 46, 26, 46, 40],
            },
        },
        ceb: {
            chapters: {
                "2Cor": [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 13],
                Rev: [
                    20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 18, 18, 20, 8, 21, 18, 24,
                    21, 15, 27, 21,
                ],
                Tob: [22, 14, 17, 21, 22, 18, 16, 21, 6, 13, 18, 22, 18, 15],
                PrAzar: [67],
                EpJer: [72],
                "1Esd": [55, 26, 24, 63, 71, 33, 15, 92, 55],
            },
        },
        kjv: {chapters: {"3John": [14]}},
        nab: {
            order: {
                Gen: 1,
                Exod: 2,
                Lev: 3,
                Num: 4,
                Deut: 5,
                Josh: 6,
                Judg: 7,
                Ruth: 8,
                "1Sam": 9,
                "2Sam": 10,
                "1Kgs": 11,
                "2Kgs": 12,
                "1Chr": 13,
                "2Chr": 14,
                PrMan: 15,
                Ezra: 16,
                Neh: 17,
                "1Esd": 18,
                "2Esd": 19,
                Tob: 20,
                Jdt: 21,
                Esth: 22,
                GkEsth: 23,
                "1Macc": 24,
                "2Macc": 25,
                "3Macc": 26,
                "4Macc": 27,
                Job: 28,
                Ps: 29,
                Prov: 30,
                Eccl: 31,
                Song: 32,
                Wis: 33,
                Sir: 34,
                Isa: 35,
                Jer: 36,
                Lam: 37,
                Bar: 38,
                EpJer: 39,
                Ezek: 40,
                Dan: 41,
                PrAzar: 42,
                Sus: 43,
                Bel: 44,
                SgThree: 45,
                Hos: 46,
                Joel: 47,
                Amos: 48,
                Obad: 49,
                Jonah: 50,
                Mic: 51,
                Nah: 52,
                Hab: 53,
                Zeph: 54,
                Hag: 55,
                Zech: 56,
                Mal: 57,
                Matt: 58,
                Mark: 59,
                Luke: 60,
                John: 61,
                Acts: 62,
                Rom: 63,
                "1Cor": 64,
                "2Cor": 65,
                Gal: 66,
                Eph: 67,
                Phil: 68,
                Col: 69,
                "1Thess": 70,
                "2Thess": 71,
                "1Tim": 72,
                "2Tim": 73,
                Titus: 74,
                Phlm: 75,
                Heb: 76,
                Jas: 77,
                "1Pet": 78,
                "2Pet": 79,
                "1John": 80,
                "2John": 81,
                "3John": 82,
                Jude: 83,
                Rev: 84,
            },
            chapters: {
                Gen: [
                    31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27,
                    33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 54, 33, 20, 31,
                    29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26,
                ],
                Exod: [
                    22, 25, 22, 31, 23, 30, 29, 28, 35, 29, 10, 51, 22, 31, 27, 36, 16,
                    27, 25, 26, 37, 30, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35,
                    35, 38, 29, 31, 43, 38,
                ],
                Lev: [
                    17, 16, 17, 35, 26, 23, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30,
                    37, 27, 24, 33, 44, 23, 55, 46, 34,
                ],
                Num: [
                    54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 35, 28,
                    32, 22, 29, 35, 41, 30, 25, 19, 65, 23, 31, 39, 17, 54, 42, 56, 29,
                    34, 13,
                ],
                Deut: [
                    46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 31, 19, 29, 23, 22, 20,
                    22, 21, 20, 23, 29, 26, 22, 19, 19, 26, 69, 28, 20, 30, 52, 29, 12,
                ],
                "1Sam": [
                    28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58,
                    30, 24, 42, 16, 23, 28, 23, 44, 25, 12, 25, 11, 31, 13,
                ],
                "2Sam": [
                    27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29,
                    32, 44, 26, 22, 51, 39, 25,
                ],
                "1Kgs": [
                    53, 46, 28, 20, 32, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24,
                    46, 21, 43, 29, 54,
                ],
                "2Kgs": [
                    18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 20, 22, 25, 29, 38, 20, 41,
                    37, 37, 21, 26, 20, 37, 20, 30,
                ],
                "1Chr": [
                    54, 55, 24, 43, 41, 66, 40, 40, 44, 14, 47, 41, 14, 17, 29, 43, 27,
                    17, 19, 8, 30, 19, 32, 31, 31, 32, 34, 21, 30,
                ],
                "2Chr": [
                    18, 17, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 23, 14, 19, 14, 19,
                    34, 11, 37, 20, 12, 21, 27, 28, 23, 9, 27, 36, 27, 21, 33, 25, 33, 27,
                    23,
                ],
                Neh: [11, 20, 38, 17, 19, 19, 72, 18, 37, 40, 36, 47, 31],
                Job: [
                    22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16,
                    21, 29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 16,
                    33, 24, 41, 30, 32, 26, 17,
                ],
                Ps: [
                    6, 11, 9, 9, 13, 11, 18, 10, 21, 18, 7, 9, 6, 7, 5, 11, 15, 51, 15,
                    10, 14, 32, 6, 10, 22, 12, 14, 9, 11, 13, 25, 11, 22, 23, 28, 13, 40,
                    23, 14, 18, 14, 12, 5, 27, 18, 12, 10, 15, 21, 23, 21, 11, 7, 9, 24,
                    14, 12, 12, 18, 14, 9, 13, 12, 11, 14, 20, 8, 36, 37, 6, 24, 20, 28,
                    23, 11, 13, 21, 72, 13, 20, 17, 8, 19, 13, 14, 17, 7, 19, 53, 17, 16,
                    16, 5, 23, 11, 13, 12, 9, 9, 5, 8, 29, 22, 35, 45, 48, 43, 14, 31, 7,
                    10, 10, 9, 8, 18, 19, 2, 29, 176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3,
                    18, 3, 3, 21, 26, 9, 8, 24, 14, 10, 8, 12, 15, 21, 10, 20, 14, 9, 6,
                ],
                Eccl: [18, 26, 22, 17, 19, 12, 29, 17, 18, 20, 10, 14],
                Song: [17, 17, 11, 16, 16, 12, 14, 14],
                Isa: [
                    31, 22, 26, 6, 30, 13, 25, 23, 20, 34, 16, 6, 22, 32, 9, 14, 14, 7,
                    25, 6, 17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22,
                    38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17,
                    13, 12, 21, 14, 21, 22, 11, 12, 19, 11, 25, 24,
                ],
                Jer: [
                    19, 37, 25, 31, 31, 30, 34, 23, 25, 25, 23, 17, 27, 22, 21, 21, 27,
                    23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22,
                    19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34,
                ],
                Ezek: [
                    28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32,
                    14, 44, 37, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15,
                    38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35,
                ],
                Dan: [21, 49, 100, 34, 30, 29, 28, 27, 27, 21, 45, 13, 64, 42],
                Hos: [9, 25, 5, 19, 15, 11, 16, 14, 17, 15, 11, 15, 15, 10],
                Joel: [20, 27, 5, 21],
                Jonah: [16, 11, 10, 11],
                Mic: [16, 13, 12, 14, 14, 16, 20],
                Nah: [14, 14, 19],
                Zech: [17, 17, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21],
                Mal: [14, 17, 24],
                Acts: [
                    26, 47, 26, 37, 42, 15, 60, 40, 43, 49, 30, 25, 52, 28, 41, 40, 34,
                    28, 40, 38, 40, 30, 35, 27, 27, 32, 44, 31,
                ],
                "2Cor": [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 13],
                Rev: [
                    20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 18, 18, 20, 8, 21, 18, 24,
                    21, 15, 27, 21,
                ],
                Tob: [22, 14, 17, 21, 22, 18, 17, 21, 6, 13, 18, 22, 18, 15],
                Sir: [
                    30, 18, 31, 31, 15, 37, 36, 19, 18, 31, 34, 18, 26, 27, 20, 30, 32,
                    33, 30, 31, 28, 27, 27, 33, 26, 29, 30, 26, 28, 25, 31, 24, 33, 31,
                    26, 31, 31, 34, 35, 30, 22, 25, 33, 23, 26, 20, 25, 25, 16, 29, 30,
                ],
                Bar: [22, 35, 38, 37, 9, 72],
                "2Macc": [36, 32, 40, 50, 27, 31, 42, 36, 29, 38, 38, 46, 26, 46, 39],
            },
        },
        nlt: {
            chapters: {
                Rev: [
                    20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 18, 18, 20, 8, 21, 18, 24,
                    21, 15, 27, 21,
                ],
            },
        },
        nrsv: {
            chapters: {
                "2Cor": [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 13],
                Rev: [
                    20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 18, 18, 20, 8, 21, 18, 24,
                    21, 15, 27, 21,
                ],
            },
        },
    };
    n.prototype.languages = ["en"];
    n.prototype.regexps.space = "[\\s\\xa0]";
    n.prototype.regexps.escaped_passage = RegExp(
        "(?:^|[^\\x1f\\x1e\\dA-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:ch(?:apters?|a?pts?\\.?|a?p?s?\\.?)?\\s*\\d+\\s*(?:[\\u2013\\u2014\\-]|through|thru|to)\\s*\\d+\\s*(?:from|of|in)(?:\\s+the\\s+book\\s+of)?\\s*)|(?:ch(?:apters?|a?pts?\\.?|a?p?s?\\.?)?\\s*\\d+\\s*(?:from|of|in)(?:\\s+the\\s+book\\s+of)?\\s*)|(?:\\d+(?:th|nd|st)\\s*ch(?:apter|a?pt\\.?|a?p?\\.?)?\\s*(?:from|of|in)(?:\\s+the\\s+book\\s+of)?\\s*))?\\x1f(\\d+)(?:/\\d+)?\\x1f(?:/\\d+\\x1f|[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014]|title(?![a-z])|see" +
        n.prototype.regexps.space +
        "+also|ff(?![a-z0-9])|f(?![a-z0-9])|chapters|chapter|through|compare|chapts|verses|chpts|chapt|chaps|verse|chap|thru|also|chp|chs|cha|and|see|ver|vss|ch|to|cf|vs|vv|v|[a-e](?!\\w)|$)+)",
        "gi"
    );
    n.prototype.regexps.match_end_split =
        /\d\W*title|\d\W*(?:ff(?![a-z0-9])|f(?![a-z0-9]))(?:[\s\xa0*]*\.)?|\d[\s\xa0*]*[a-e](?!\w)|\x1e(?:[\s\xa0*]*[)\]\uff09])?|[\d\x1f]/gi;
    n.prototype.regexps.control = /[\x1e\x1f]/g;
    n.prototype.regexps.pre_book =
        "[^A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff]";
    n.prototype.regexps.first =
        "(?:1st|1|I|First)\\.?" + n.prototype.regexps.space + "*";
    n.prototype.regexps.second =
        "(?:2nd|2|II|Second)\\.?" + n.prototype.regexps.space + "*";
    n.prototype.regexps.third =
        "(?:3rd|3|III|Third)\\.?" + n.prototype.regexps.space + "*";
    n.prototype.regexps.range_and =
        "(?:[&\u2013\u2014-]|(?:and|compare|cf|see" +
        n.prototype.regexps.space +
        "+also|also|see)|(?:through|thru|to))";
    n.prototype.regexps.range_only = "(?:[\u2013\u2014-]|(?:through|thru|to))";
    n.prototype.regexps.get_books = function (k, a) {
        var d;
        var c = [
            {
                osis: ["Ps"],
                apocrypha: !0,
                extra: "2",
                regexp: /(\b)(Ps151)(?=\.1)/g,
            },
            {
                osis: ["Gen"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Genes[ei]s)|(?:G(?:e(?:n(?:n(?:e(?:is(?:[eiu]s)?|s[eiu]s|es[eiu]s)|(?:i[ei]s[eiu]|is[eiu]|si)s)|(?:eis[eiu]|esu|si)s|es[ei]|eis|is[eiu]s|(?:i[ei]|ee)s[eiu]s)?)?|n)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Exod"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Ex(?:o(?:d(?:[iu]s|[es])?)?|d)?))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Bel"],
                apocrypha: !0,
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Bel(?:[\\s\\xa0]*(?:and[\\s\\xa0]*(?:the[\\s\\xa0]*(?:S(?:erpent|nake)|Dragon)|S(?:erpent|nake)|Dragon)|&[\\s\\xa0]*(?:the[\\s\\xa0]*(?:S(?:erpent|nake)|Dragon)|S(?:erpent|nake)|Dragon)))?))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Lev"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:L(?:e(?:v(?:it[ei]?cus|i|et[ei]?cus)?)?|iv[ei]t[ei]?cus|v)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Num"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:N(?:u(?:m(?:b(?:ers?)?)?)?|m)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Sir"],
                apocrypha: !0,
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Sirach)|(?:Wisdom[\\s\\xa0]*of[\\s\\xa0]*Jesus(?:[\\s\\xa0]*(?:Son[\\s\\xa0]*of|ben)|,[\\s\\xa0]*Son[\\s\\xa0]*of)[\\s\\xa0]*Sirach|Ecc(?:l[eu]siasticu)?s|Ben[\\s\\xa0]*Sira|Sir|Ecclus|The[\\s\\xa0]*Wisdom[\\s\\xa0]*of[\\s\\xa0]*Jesus(?:[\\s\\xa0]*(?:Son[\\s\\xa0]*of|ben)|,[\\s\\xa0]*Son[\\s\\xa0]*of)[\\s\\xa0]*Sirach))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Wis"],
                apocrypha: !0,
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Wis(?:(?:d(?:om)?)?[\\s\\xa0]*of[\\s\\xa0]*Solomon|d(?:om)?|om[\\s\\xa0]*of[\\s\\xa0]*Solomon)?|The[\\s\\xa0]*Wis(?:d(?:om)?|om)?[\\s\\xa0]*of[\\s\\xa0]*Solomon))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Lam"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:L(?:a(?:m(?:[ei]ntations?)?)?|m)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["EpJer"],
                apocrypha: !0,
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Ep(?:istle[\\s\\xa0]*of[\\s\\xa0]*Jeremy|[\\s\\xa0]*?Jer|istle[\\s\\xa0]*of[\\s\\xa0]*Jeremiah|[\\s\\xa0]*of[\\s\\xa0]*Jeremiah)|Let[\\s\\xa0]*of[\\s\\xa0]*Jeremiah|(?:Let(?:ter|\\.)|Ep\\.)[\\s\\xa0]*of[\\s\\xa0]*Jeremiah|The[\\s\\xa0]*(?:Ep(?:istle|\\.)?|Let(?:ter|\\.)?)[\\s\\xa0]*of[\\s\\xa0]*Jeremiah))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Rev"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:R(?:e(?:v(?:elations?|el|lations?|[ao]lations?)?)?|v)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["PrMan"],
                apocrypha: !0,
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Pr(?:ayer(?:s[\\s\\xa0]*(?:of[\\s\\xa0]*)?|[\\s\\xa0]*(?:of[\\s\\xa0]*)?)Manasseh|[\\s\\xa0]*Manasseh|[\\s\\xa0]*?Man|[\\s\\xa0]*of[\\s\\xa0]*Manasseh)|The[\\s\\xa0]*Pr(?:ayer(?:s[\\s\\xa0]*(?:of[\\s\\xa0]*)?|[\\s\\xa0]*(?:of[\\s\\xa0]*)?)|[\\s\\xa0]*(?:of[\\s\\xa0]*)?)Manasseh))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Deut"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Duet[eo]rono?my)|(?:D(?:e(?:u(?:t[eo]rono?my|trono?my|t)?|et(?:[eo]rono?|rono?)my)|uut(?:[eo]rono?|rono?)my|uetrono?my|(?:ue)?t)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Josh"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:J(?:o(?:s(?:h?ua|h)?|ush?ua)|sh)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Judg"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:J(?:udg(?:es)?|d?gs|d?g)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Ruth"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:R(?:u(?:th?)?|th?)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["1Esd"],
                apocrypha: !0,
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:1(?:st)?|I)[\s\xa0]*Esd(?:r(?:as)?)?|1Esd|(?:1(?:st)?|I)\.[\s\xa0]*Esd(?:r(?:as)?)?|First[\s\xa0]*Esd(?:r(?:as)?)?))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["2Esd"],
                apocrypha: !0,
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:2(?:nd)?|II)[\s\xa0]*Esd(?:r(?:as)?)?|2Esd|(?:2(?:nd)?|II)\.[\s\xa0]*Esd(?:r(?:as)?)?|Second[\s\xa0]*Esd(?:r(?:as)?)?))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["Isa"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Isaisha?)|(?:I(?:s(?:a(?:a(?:[ai](?:[ai]ha?|ha?)|ha?)|i[ai](?:[ai]ha?|ha?)|i?ha?|i)?|i[ai](?:[ai](?:[ai]ha?|ha?)|ha?)|iha|sah)?|a)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["2Sam"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:2(?:nd)?|II)\.[\s\xa0]*S(?:amu[ae]l[ls]|ma)|(?:2(?:nd)?|II)[\s\xa0]*S(?:amu[ae]l[ls]|ma)|Second[\s\xa0]*S(?:amu[ae]l[ls]|ma))|(?:2(?:[\s\xa0]*Samu[ae]l|(?:[\s\xa0]*S|Sa)m|[\s\xa0]*S(?:am?)?|[\s\xa0]*Kingdoms)|(?:2nd|II)[\s\xa0]*(?:S(?:amu[ae]l|m|am?)|Kingdoms)|(?:2(?:nd)?|II)\.[\s\xa0]*(?:S(?:amu[ae]l|m|am?)|Kingdoms)|Second[\s\xa0]*(?:S(?:amu[ae]l|m|am?)|Kingdoms)))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["1Sam"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:1st(?:\.[\s\xa0]*S(?:amu[ae]l[ls]|ma)|[\s\xa0]*S(?:amu[ae]l[ls]|ma)))|(?:1(?:st(?:\.[\s\xa0]*(?:S(?:amu[ae]l|m|am?)|Kingdoms)|[\s\xa0]*(?:S(?:amu[ae]l|m|am?)|Kingdoms))|\.[\s\xa0]*S(?:amu[ae]l[ls]|ma)|[\s\xa0]*S(?:amu[ae]l[ls]|ma))|(?:First|I\.)[\s\xa0]*S(?:amu[ae]l[ls]|ma)|I[\s\xa0]*S(?:amu[ae]l[ls]|ma))|(?:1(?:[\s\xa0]*Samu[ae]l|(?:[\s\xa0]*S|Sa)m|[\s\xa0]*S(?:am?)?|[\s\xa0]*Kingdoms)|I[\s\xa0]*(?:S(?:amu[ae]l|m|am?)|Kingdoms)|[1I]\.[\s\xa0]*(?:S(?:amu[ae]l|m|am?)|Kingdoms)|First[\s\xa0]*(?:S(?:amu[ae]l|m|am?)|Kingdoms))|(?:Samu[ae]l[ls]?))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["2Kgs"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:(?:Second|2\.)[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|2[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|2nd(?:\.[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?)|II(?:\.[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?))s|(?:Second|2\.)[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|2[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|2nd(?:\.[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?)|II(?:\.[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?)|2Kgs|(?:4(?:th)?|IV)[\s\xa0]*Kingdoms|(?:4(?:th)?|IV)\.[\s\xa0]*Kingdoms|Fourth[\s\xa0]*Kingdoms))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["1Kgs"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:(?:1(?:st)?\.|First)[\s\xa0]*K(?:i(?:ng?|g)|ng?|g)?|1(?:st)?[\s\xa0]*K(?:i(?:ng?|g)|ng?|g)?|I(?:\.[\s\xa0]*K(?:i(?:ng?|g)|ng?|g)?|[\s\xa0]*K(?:i(?:ng?|g)|ng?|g)?))s|(?:1(?:st)?\.|First)[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|1(?:st)?[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|I(?:\.[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?)|1Kgs|(?:3(?:rd)?|III)[\s\xa0]*Kingdoms|(?:3(?:rd)?|III)\.[\s\xa0]*Kingdoms|Third[\s\xa0]*Kingdoms)|(?:K(?:in(?:gs)?|n?gs)))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["2Chr"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:2[\s\xa0]*C(?:h(?:oron[io]|ron[io])|ron[io])|(?:2nd|II)[\s\xa0]*Chrono|(?:2(?:nd)?|II)\.[\s\xa0]*Chrono|Second[\s\xa0]*Chrono)cles)|(?:(?:2nd|II)[\s\xa0]*(?:C(?:h(?:r(?:on(?:icals|ocle)|n|onicles)|oron[io]cles)|(?:oron[io]|ron[io])cles|h(?:r(?:onicle|on?)?|oron[io]cle)|ron(?:[io]cle)?|oron[io]cle)|Paralipomenon)|2(?:[\s\xa0]*C(?:h(?:oron[io]|rono)|ron[io])cle|[\s\xa0]*Chronicle|[\s\xa0]*Chrn|Chr|[\s\xa0]*Chronicals|[\s\xa0]*Coron[io]cles|[\s\xa0]*C(?:h(?:r(?:on?)?)?|ron|oron[io]cle)|[\s\xa0]*Paralipomenon)|(?:2(?:nd)?|II)\.[\s\xa0]*(?:C(?:h(?:r(?:on(?:icals|ocle)|n|onicles)|oron[io]cles)|(?:oron[io]|ron[io])cles|h(?:r(?:onicle|on?)?|oron[io]cle)|ron(?:[io]cle)?|oron[io]cle)|Paralipomenon)|Second[\s\xa0]*(?:C(?:h(?:r(?:on(?:icals|ocle)|n|onicles)|oron[io]cles)|(?:oron[io]|ron[io])cles|h(?:r(?:onicle|on?)?|oron[io]cle)|ron(?:[io]cle)?|oron[io]cle)|Paralipomenon)))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["1Chr"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:1[\s\xa0]*Ch(?:orono|roni)|(?:1st|I)[\s\xa0]*Chrono|(?:1(?:st)?|I)\.[\s\xa0]*Chrono|First[\s\xa0]*Chrono)cles)|(?:1(?:[\s\xa0]*Chronicle|[\s\xa0]*Chrn|Chr)|(?:1[\s\xa0]*Chorono|Choroni)cle|1[\s\xa0]*C(?:ron[io]|hrono|oron[io])cles|1[\s\xa0]*Chronicals|1[\s\xa0]*Choronicles|1[\s\xa0]*C(?:(?:ron[io]|hrono|oron[io])cle|h(?:r(?:on?)?)?|ron)|1[\s\xa0]*Paralipomenon|(?:1st|I)[\s\xa0]*(?:C(?:h(?:r(?:onocle|n|onicles|onicals)|oron[io]cles)|(?:oron[io]|ron[io])cles|h(?:r(?:onicle|on?)?|oronocle)|(?:oron[io]|ron[io])cle|ron)|Paralipomenon)|(?:1(?:st)?|I)\.[\s\xa0]*(?:C(?:h(?:r(?:onocle|n|onicles|onicals)|oron[io]cles)|(?:oron[io]|ron[io])cles|h(?:r(?:onicle|on?)?|oronocle)|(?:oron[io]|ron[io])cle|ron)|Paralipomenon)|First[\s\xa0]*(?:C(?:h(?:r(?:onocle|n|onicles|onicals)|oron[io]cles)|(?:oron[io]|ron[io])cles|h(?:r(?:onicle|on?)?|oronocle)|(?:oron[io]|ron[io])cle|ron)|Paralipomenon))|(?:C(?:(?:h(?:ron(?:ic(?:al|le)|ocle)|oron[io]cle)|(?:oron[io]|ron[io])cle)s|(?:h(?:ron[io]|orono)|oron[io]|ron[io])cle)|Paralipomenon))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["Ezra"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:E(?:zra?|sra)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Neh"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Ne(?:h(?:[ei]m(?:i(?:a[ai]h|a?h|a|i[ai]?h)|a(?:[ai][ai]?)?h)|amiah|amia)?)?))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["GkEsth"],
                apocrypha: !0,
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:G(?:r(?:eek[\\s\\xa0]*Esther|[\\s\\xa0]*Esth)|k[\\s\\xa0]*?Esth|r(?:eek[\\s\\xa0]*Esth?|[\\s\\xa0]*Est)|k[\\s\\xa0]*Est)|Esther[\\s\\xa0]*\\(Greek\\)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Esth"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Es(?:t(?:h(?:er|r)?|er)?)?))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Job"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Jo?b))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Ps"],
                extra: "1",
                regexp: RegExp(
                    "(\\b)((?:(?:(?:1[02-5]|[2-9])?(?:1" +
                    n.prototype.regexps.space +
                    "*st|2" +
                    n.prototype.regexps.space +
                    "*nd|3" +
                    n.prototype.regexps.space +
                    "*rd))|1?1[123]" +
                    n.prototype.regexps.space +
                    "*th|(?:150|1[0-4][04-9]|[1-9][04-9]|[4-9])" +
                    n.prototype.regexps.space +
                    "*th)" +
                    n.prototype.regexps.space +
                    "*Psalm)\\b",
                    "gi"
                ),
            },
            {
                osis: ["Ps"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Psmals)|(?:Ps(?:a(?:(?:lm[alm]|mm)s?|(?:l[al]|ml)ms?|alms?)|(?:m(?:alm|l)|lam)s?|mal|lalms?))|(?:Psal[am]s?)|(?:Psals?)|(?:P(?:s(?:l(?:m[ms]|a)|m[am]|sm|a(?:m(?:l[as]|s)|aa))|asms|(?:a(?:s(?:ml|s)|m[ls]|l[lm])|s(?:a(?:am|ma)|lma))s|s(?:a(?:ml?)?|m|s|lm)?|a(?:ls|sl)ms?|l(?:a(?:s(?:m(?:as?|s)?|s)?|m(?:a?s)?|as?)|s(?:a?m|sss)s?|s(?:ss?|a)|ms))|Salms?))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["PrAzar"],
                apocrypha: !0,
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Pr(?:[\\s\\xa0]*Aza|Aza?)r|Azariah?|Pr[\\s\\xa0]*of[\\s\\xa0]*Azariah?|Prayer(?:s[\\s\\xa0]*of[\\s\\xa0]*Azariah?|[\\s\\xa0]*of[\\s\\xa0]*Azariah?)|The[\\s\\xa0]*Pr(?:ayer(?:s[\\s\\xa0]*of[\\s\\xa0]*Azariah?|[\\s\\xa0]*of[\\s\\xa0]*Azariah?)|[\\s\\xa0]*of[\\s\\xa0]*Azariah?)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Prov"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Prover?bs)|(?:Prverbs)|(?:P(?:r(?:(?:ever|v)bs|verb|everb|vb|v|o(?:bv?erbs|verb|v)?)?|or?verbs|v)|Oroverbs))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Eccl"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Ec(?:les(?:i(?:a(?:ias|s)?|s)|sias?)t|clesia(?:sti?|t))es)|(?:Ec(?:c(?:l(?:es(?:i(?:a(?:s?te|st|ates|astes|ia?stes)|(?:ias|s)?tes)|(?:ai?|sia)stes|(?:sia|ai)tes|(?:aia|sai)stes)?)?)?|lesiaste|l)?|Qo(?:heleth|h)?))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["SgThree"],
                apocrypha: !0,
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:S(?:[\s\xa0]*(?:of[\s\xa0]*(?:Th(?:ree(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|3(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y)))|Th(?:ree(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|3(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y)))|(?:g[\s\xa0]*?|ng[\s\xa0]*|ong[\s\xa0]*)Three|\.[\s\xa0]*(?:of[\s\xa0]*(?:Th(?:ree(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|3(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y)))|Th(?:ree(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|3(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y)))|g[\s\xa0]*Thr)|The[\s\xa0]*Song[\s\xa0]*of[\s\xa0]*(?:the[\s\xa0]*(?:Three[\s\xa0]*(?:(?:Youth|Jew)s|Young[\s\xa0]*Men|Holy[\s\xa0]*Children)|3[\s\xa0]*(?:(?:Youth|Jew)s|Young[\s\xa0]*Men|Holy[\s\xa0]*Children))|Three[\s\xa0]*(?:(?:Youth|Jew)s|Young[\s\xa0]*Men|Holy[\s\xa0]*Children)|3[\s\xa0]*(?:(?:Youth|Jew)s|Young[\s\xa0]*Men|Holy[\s\xa0]*Children)))|(?:Song[\s\xa0]*of[\s\xa0]*(?:the[\s\xa0]*(?:Three[\s\xa0]*(?:(?:Youth|Jew)s|Young[\s\xa0]*Men|Holy[\s\xa0]*Children)|3[\s\xa0]*(?:(?:Youth|Jew)s|Young[\s\xa0]*Men|Holy[\s\xa0]*Children))|Three[\s\xa0]*(?:(?:Youth|Jew)s|Young[\s\xa0]*Men|Holy[\s\xa0]*Children)|3[\s\xa0]*(?:(?:Youth|Jew)s|Young[\s\xa0]*Men|Holy[\s\xa0]*Children))))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["Song"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:The[\\s\\xa0]*Song(?:s[\\s\\xa0]*of[\\s\\xa0]*S(?:o(?:lom[ao]ns?|ngs?)|alom[ao]ns?)|[\\s\\xa0]*of[\\s\\xa0]*S(?:o(?:lom[ao]ns?|ngs?)|alom[ao]ns?))|S(?:o[Sln]|S|[\\s\\xa0]*of[\\s\\xa0]*S|o|n?gs?))|(?:Song(?:s(?:[\\s\\xa0]*of[\\s\\xa0]*S(?:o(?:lom[ao]ns?|ngs?)|alom[ao]ns?))?|[\\s\\xa0]*of[\\s\\xa0]*S(?:o(?:lom[ao]ns?|ngs?)|alom[ao]ns?))?))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Jer"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:J(?:e(?:r(?:(?:im(?:i[ai]|a)|m[im]a|a(?:m[ai]i|ia))h|(?:ama|imi)h|amiha|amiah|amia|amih|e(?:m(?:i(?:ha|e|ah|a|h|ih)?|a(?:ia?)?h))?)?)?|r)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Ezek"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Eze[ei]ki?el)|(?:E(?:z(?:ek(?:i[ae]|e)l|ek?|k|i(?:[ei]ki?|ki?)el)|x[ei](?:[ei]ki?|ki?)el)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Dan"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:D(?:a(?:n(?:i[ae]l)?)?|[ln])))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Hos"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:H(?:o(?:s(?:ea)?)?|s)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Joel"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:J(?:oel?|l)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Amos"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Am(?:os?|s)?))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Obad"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Ob(?:a(?:d(?:iah?)?)?|idah|d)?))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Jonah"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:J(?:on(?:ah)?|nh)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Mic"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Mi(?:c(?:hah?|ah?)?)?))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Nah"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Na(?:h(?:um?)?)?))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Hab"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Hab(?:ak(?:k[au]kk?|[au]kk?)|k|bak(?:k[au]kk?|[au]kk?))?))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Zeph"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Z(?:e(?:p(?:h(?:an(?:aiah?|iah?))?)?|faniah?)|a(?:ph|f)aniah?|ph?)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Hag"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:H(?:ag(?:g(?:ia[hi]|ai)?|ai)?|gg?)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Zech"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Z(?:ec(?:h(?:[ae]r(?:i(?:a?h|a|ih)|a[ai]?h))?)?|(?:ekaria|c)h|ekaria|c|a(?:c(?:h(?:[ae]r(?:i(?:a?h|a|ih)|a[ai]?h))?)?|kariah))))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Mal"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Mal(?:ac(?:hi?|i)|ichi)?))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Matt"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:The[\\s\\xa0]*Gospel[\\s\\xa0]*(?:according[\\s\\xa0]*to[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i)|[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i))|aint[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i))|Matt(?:h(?:[ht]i?|i)|thi?|t?i))|of[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i)|[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i))|aint[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i))|Matt(?:h(?:[ht]i?|i)|thi?|t?i)))ew)|(?:The[\\s\\xa0]*Gospel[\\s\\xa0]*(?:according[\\s\\xa0]*to[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*Matt[ht]?|[\\s\\xa0]*Matt[ht]?)|aint[\\s\\xa0]*Matt[ht]?)|Matt[ht]?)|of[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*Matt[ht]?|[\\s\\xa0]*Matt[ht]?)|aint[\\s\\xa0]*Matt[ht]?)|Matt[ht]?))ew)|(?:The[\\s\\xa0]*Gospel[\\s\\xa0]*(?:according[\\s\\xa0]*to[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t)|[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t))|aint[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t))|M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t))|of[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t)|[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t))|aint[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t))|M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t)))|Mtt)|(?:Gospel[\\s\\xa0]*(?:according[\\s\\xa0]*to[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i)|[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i))|aint[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i))|Matt(?:h(?:[ht]i?|i)|thi?|t?i))|of[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i)|[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i))|aint[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i))|Matt(?:h(?:[ht]i?|i)|thi?|t?i)))ew)|(?:(?:S(?:t(?:\\.[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i)|[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i))|aint[\\s\\xa0]*Matt(?:h(?:[ht]i?|i)|thi?|t?i))|Matt(?:h(?:[ht]i?|i)|thi?|t?i))ew)|(?:Gospel[\\s\\xa0]*(?:according[\\s\\xa0]*to[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*Matt[ht]?|[\\s\\xa0]*Matt[ht]?)|aint[\\s\\xa0]*Matt[ht]?)|Matt[ht]?)|of[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*Matt[ht]?|[\\s\\xa0]*Matt[ht]?)|aint[\\s\\xa0]*Matt[ht]?)|Matt[ht]?))ew)|(?:Gospel[\\s\\xa0]*(?:according[\\s\\xa0]*to[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t)|[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t))|aint[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t))|M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t))|of[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t)|[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t))|aint[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t))|M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t))))|(?:(?:S(?:t(?:\\.[\\s\\xa0]*Matt[ht]?|[\\s\\xa0]*Matt[ht]?)|aint[\\s\\xa0]*Matt[ht]?)|Matt[ht]?)ew)|(?:S(?:t(?:\\.[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t)|[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t))|aint[\\s\\xa0]*M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t)))|(?:M(?:at(?:h(?:[ht](?:[ht]i?|i)?|i)?ew|th?we|t)?|t)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Mark"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:The[\\s\\xa0]*Gospel[\\s\\xa0]*(?:according[\\s\\xa0]*to[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*M(?:rk?|k|ark?)|[\\s\\xa0]*M(?:rk?|k|ark?))|aint[\\s\\xa0]*M(?:rk?|k|ark?))|M(?:rk?|k|ark?))|of[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*M(?:rk?|k|ark?)|[\\s\\xa0]*M(?:rk?|k|ark?))|aint[\\s\\xa0]*M(?:rk?|k|ark?))|M(?:rk?|k|ark?))))|(?:Gospel[\\s\\xa0]*(?:according[\\s\\xa0]*to[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*M(?:rk?|k|ark?)|[\\s\\xa0]*M(?:rk?|k|ark?))|aint[\\s\\xa0]*M(?:rk?|k|ark?))|M(?:rk?|k|ark?))|of[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*M(?:rk?|k|ark?)|[\\s\\xa0]*M(?:rk?|k|ark?))|aint[\\s\\xa0]*M(?:rk?|k|ark?))|M(?:rk?|k|ark?)))|S(?:t(?:\\.[\\s\\xa0]*M(?:rk?|k|ark?)|[\\s\\xa0]*M(?:rk?|k|ark?))|aint[\\s\\xa0]*M(?:rk?|k|ark?))|M(?:rk?|k|ark?)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Luke"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:The[\\s\\xa0]*Gospel[\\s\\xa0]*(?:according[\\s\\xa0]*to[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*L(?:u(?:ke?)?|k)|[\\s\\xa0]*L(?:u(?:ke?)?|k))|aint[\\s\\xa0]*L(?:u(?:ke?)?|k))|L(?:u(?:ke?)?|k))|of[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*L(?:u(?:ke?)?|k)|[\\s\\xa0]*L(?:u(?:ke?)?|k))|aint[\\s\\xa0]*L(?:u(?:ke?)?|k))|L(?:u(?:ke?)?|k))))|(?:Gospel[\\s\\xa0]*(?:according[\\s\\xa0]*to[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*L(?:u(?:ke?)?|k)|[\\s\\xa0]*L(?:u(?:ke?)?|k))|aint[\\s\\xa0]*L(?:u(?:ke?)?|k))|L(?:u(?:ke?)?|k))|of[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*L(?:u(?:ke?)?|k)|[\\s\\xa0]*L(?:u(?:ke?)?|k))|aint[\\s\\xa0]*L(?:u(?:ke?)?|k))|L(?:u(?:ke?)?|k)))|S(?:t(?:\\.[\\s\\xa0]*L(?:u(?:ke?)?|k)|[\\s\\xa0]*L(?:u(?:ke?)?|k))|aint[\\s\\xa0]*L(?:u(?:ke?)?|k))|L(?:u(?:ke?)?|k)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["1John"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:1(?:st)?|I)[\s\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)?|h[ho]n|h?n|h|phn)|1John|(?:1(?:st)?|I)\.[\s\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)?|h[ho]n|h?n|h|phn)|First[\s\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)?|h[ho]n|h?n|h|phn)))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["2John"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:2(?:nd)?|II)[\s\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)?|h[ho]n|h?n|h|phn)|2John|(?:2(?:nd)?|II)\.[\s\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)?|h[ho]n|h?n|h|phn)|Second[\s\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)?|h[ho]n|h?n|h|phn)))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["3John"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:3(?:rd)?|III)[\s\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)?|h[ho]n|h?n|h|phn)|3John|(?:3(?:rd)?|III)\.[\s\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)?|h[ho]n|h?n|h|phn)|Third[\s\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)?|h[ho]n|h?n|h|phn)))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["John"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:The[\\s\\xa0]*Gospel[\\s\\xa0]*(?:according[\\s\\xa0]*to[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn)|[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn))|aint[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn))|J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn))|of[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn)|[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn))|aint[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn))|J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn))))|(?:Gospel[\\s\\xa0]*(?:according[\\s\\xa0]*to[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn)|[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn))|aint[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn))|J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn))|of[\\s\\xa0]*(?:S(?:t(?:\\.[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn)|[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn))|aint[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn))|J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn)))|S(?:t(?:\\.[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn)|[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn))|aint[\\s\\xa0]*J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn))|J(?:o(?:h[mn]|nh|h|on|phn)|h[ho]n|h?n|h|phn)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Acts"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Actsss)|(?:Actss)|(?:Ac(?:ts[\\s\\xa0]*of[\\s\\xa0]*the[\\s\\xa0]*Apostles|ts?)?|The[\\s\\xa0]*Acts[\\s\\xa0]*of[\\s\\xa0]*the[\\s\\xa0]*Apostles))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Rom"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:R(?:o(?:m(?:a(?:n(?:ds|s)?|sn)|s)?|amns|s)?|m(?:n?s|n)?|pmans)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["2Cor"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:(?:2(?:nd)?|II)\.[\s\xa0]*Cor(?:in(?:(?:t(?:h(?:i(?:a[ai]|o)|oa)|i[ao])|ithai)n|thia?n|(?:th[io]|ith)ian|thaian|[an]thian)|thian)|(?:2(?:nd)?|II)[\s\xa0]*Cor(?:in(?:(?:t(?:h(?:i(?:a[ai]|o)|oa)|i[ao])|ithai)n|thia?n|(?:th[io]|ith)ian|thaian|[an]thian)|thian)|Second[\s\xa0]*Cor(?:in(?:(?:t(?:h(?:i(?:a[ai]|o)|oa)|i[ao])|ithai)n|thia?n|(?:th[io]|ith)ian|thaian|[an]thian)|thian))s)|(?:(?:(?:2(?:nd)?|II)\.[\s\xa0]*Corin(?:itha|thai)|(?:2(?:nd)?|II)[\s\xa0]*Corin(?:itha|thai)|Second[\s\xa0]*Corin(?:itha|thai))ns)|(?:(?:(?:2(?:nd)?|II)\.|2(?:nd)?|II|Second)[\s\xa0]*Corinthans)|(?:(?:2(?:nd)?|II)[\s\xa0]*C(?:o(?:r(?:(?:n(?:ithaia|thai)|rin?thai|ninthai|nthia)ns|n(?:i(?:thai?|ntha)|thi)ns|thian|th|(?:(?:rin?|an|nin?)th|nthi)ians|i(?:(?:n(?:thi(?:an[ao]|na)|ithina)|th[ai]n)s|n(?:t(?:h(?:ian)?)?)?|th(?:ai|ia)ns|th(?:ii|o)ans|inthii?ans))?)?|hor(?:(?:[in]|an)thia|inth(?:ai|ia|i))ns)|2Cor|(?:2(?:nd)?|II)\.[\s\xa0]*C(?:o(?:r(?:(?:n(?:ithaia|thai)|rin?thai|ninthai|nthia)ns|n(?:i(?:thai?|ntha)|thi)ns|thian|th|(?:(?:rin?|an|nin?)th|nthi)ians|i(?:(?:n(?:thi(?:an[ao]|na)|ithina)|th[ai]n)s|n(?:t(?:h(?:ian)?)?)?|th(?:ai|ia)ns|th(?:ii|o)ans|inthii?ans))?)?|hor(?:(?:[in]|an)thia|inth(?:ai|ia|i))ns)|Second[\s\xa0]*C(?:o(?:r(?:(?:n(?:ithaia|thai)|rin?thai|ninthai|nthia)ns|n(?:i(?:thai?|ntha)|thi)ns|thian|th|(?:(?:rin?|an|nin?)th|nthi)ians|i(?:(?:n(?:thi(?:an[ao]|na)|ithina)|th[ai]n)s|n(?:t(?:h(?:ian)?)?)?|th(?:ai|ia)ns|th(?:ii|o)ans|inthii?ans))?)?|hor(?:(?:[in]|an)thia|inth(?:ai|ia|i))ns)))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["1Cor"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:(?:1(?:st)?|I)\.[\s\xa0]*Cor(?:in(?:(?:t(?:h(?:i(?:a[ai]|o)|oa)|i[ao])|ithai)n|thia?n|(?:th[io]|ith)ian|thaian|[an]thian)|thian)|(?:1(?:st)?|I)[\s\xa0]*Cor(?:in(?:(?:t(?:h(?:i(?:a[ai]|o)|oa)|i[ao])|ithai)n|thia?n|(?:th[io]|ith)ian|thaian|[an]thian)|thian)|First[\s\xa0]*Cor(?:in(?:(?:t(?:h(?:i(?:a[ai]|o)|oa)|i[ao])|ithai)n|thia?n|(?:th[io]|ith)ian|thaian|[an]thian)|thian))s)|(?:(?:(?:1(?:st)?|I)\.[\s\xa0]*Corin(?:itha|thai)|(?:1(?:st)?|I)[\s\xa0]*Corin(?:itha|thai)|First[\s\xa0]*Corin(?:itha|thai))ns)|(?:(?:(?:1(?:st)?|I)\.|1(?:st)?|I|First)[\s\xa0]*Corinthans)|(?:(?:1(?:st)?|I)[\s\xa0]*C(?:o(?:r(?:(?:n(?:ithaia|thai)|rin?thai|ninthai|nthia)ns|n(?:i(?:thai?|ntha)|thi)ns|thian|th|(?:(?:rin?|an|nin?)th|nthi)ians|i(?:(?:n(?:thi(?:an[ao]|na)|ithina)|th[ai]n)s|n(?:t(?:h(?:ian)?)?)?|th(?:ai|ia)ns|th(?:ii|o)ans|inthii?ans))?)?|hor(?:(?:[in]|an)thia|inth(?:ai|ia|i))ns)|1Cor|(?:1(?:st)?|I)\.[\s\xa0]*C(?:o(?:r(?:(?:n(?:ithaia|thai)|rin?thai|ninthai|nthia)ns|n(?:i(?:thai?|ntha)|thi)ns|thian|th|(?:(?:rin?|an|nin?)th|nthi)ians|i(?:(?:n(?:thi(?:an[ao]|na)|ithina)|th[ai]n)s|n(?:t(?:h(?:ian)?)?)?|th(?:ai|ia)ns|th(?:ii|o)ans|inthii?ans))?)?|hor(?:(?:[in]|an)thia|inth(?:ai|ia|i))ns)|First[\s\xa0]*C(?:o(?:r(?:(?:n(?:ithaia|thai)|rin?thai|ninthai|nthia)ns|n(?:i(?:thai?|ntha)|thi)ns|thian|th|(?:(?:rin?|an|nin?)th|nthi)ians|i(?:(?:n(?:thi(?:an[ao]|na)|ithina)|th[ai]n)s|n(?:t(?:h(?:ian)?)?)?|th(?:ai|ia)ns|th(?:ii|o)ans|inthii?ans))?)?|hor(?:(?:[in]|an)thia|inth(?:ai|ia|i))ns))|(?:C(?:or(?:i(?:(?:n(?:th(?:i(?:an[ao]|na)|ai?n)|ith(?:ina|an))|th[ai]n)s|nthi(?:a?ns|an)|(?:n(?:t(?:h(?:i(?:a[ai]|o)|aia)|i[ao])|ith(?:ai|ia))|th(?:ai|ia))ns|(?:n(?:[an]th|thi)i|th(?:ii|o))ans|nthoi?ans|inthii?ans)|(?:(?:rin?tha|ntha)i|nthia|ninthai|nithaia|n(?:intha|thi|ithai?)|(?:(?:nin?|rin?)th|nthi)ia)ns)|hor(?:inth(?:ai|ia|i)|(?:a?n|i)thia)ns)))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["Gal"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:G(?:a(?:l(?:a(?:t(?:(?:i(?:on[an]|nan|an[ai])|o?n)s|i(?:na?|on?|an?)s|ian|(?:i(?:a[ai]|oa)|oa)ns|ii[ao]?ns|a(?:[ao]n|n|i[ao]?n)?s)?)?|lati[ao]?ns)?)?|l)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Eph"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Eph(?:es(?:i(?:an[ds]|ons)|ains)|i?sians))|(?:E(?:p(?:h(?:es(?:ai|ia)|i?sia)n|h(?:es?|s)?|e(?:he)?sians)?|hp(?:[ei]sians)?|sphesians)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Phil"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Ph(?:il(?:ip(?:p(?:(?:i(?:a[ai]|ia|e)|(?:pi|e)a)n|ia?n|a(?:ia?)?n)|(?:i(?:[ae]|ia)?|ea?|a(?:ia?)?)n)s|p(?:(?:(?:pii|e|ppi)a|pia|ai)ns|an|ia?ns))|l(?:ipp?ians|pp)))|(?:Ph(?:i(?:l(?:l(?:i(?:p(?:(?:ai?|ia|ea)ns|(?:ai?|ia|ea)n|ie?ns|(?:i(?:a[ai]|ea)|aia|iia)ns|p(?:i(?:(?:[ei]a)?ns|a(?:ins|ns?))|(?:pia|ai)ns|eans?|ans))?)?|(?:l(?:ipi|p|i?pp)ia|p(?:ie|a))ns|(?:li|p)?pians|(?:li|p)?pian)|(?:ip(?:p(?:i?a|i|ea|pia)|ai?|ia)|pp?ia)n|i(?:pp?)?|pp?)?)?|(?:l(?:ip)?|li)?p)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Col"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Colossians)|(?:Colossian)|(?:C(?:o(?:l(?:(?:[ao]|as|l[ao])si[ao]|oss(?:io|a))ns|l(?:oss)?)?|al(?:l(?:os(?:i[ao]|sia)|asi[ao])|(?:[ao]s|[ao])si[ao])ns)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["2Thess"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:(?:2(?:nd)?|II)\.|2(?:nd)?|II|Second)[\s\xa0]*Thsss)|(?:(?:2(?:nd)?|II)[\s\xa0]*Th(?:es(?:s(?:al(?:on(?:i(?:(?:[ao]a|io|e)ns|[ao]ns|[ao]n|ns|c(?:i[ae]|a)ns)|(?:(?:oi?|e)a|cie|aia)ns|a(?:ins?|ns))|lonians)|(?:[eo]lonian)?s|[eo]lonian|olonins|elonains)?|(?:al(?:oni[ci]|loni)a|alonio|elonai)ns|[aeo]lonians|[aeo]lonian|alonins)?|ss|s)?|2Thess|(?:2(?:nd)?|II)\.[\s\xa0]*Th(?:es(?:s(?:al(?:on(?:i(?:(?:[ao]a|io|e)ns|[ao]ns|[ao]n|ns|c(?:i[ae]|a)ns)|(?:(?:oi?|e)a|cie|aia)ns|a(?:ins?|ns))|lonians)|(?:[eo]lonian)?s|[eo]lonian|olonins|elonains)?|(?:al(?:oni[ci]|loni)a|alonio|elonai)ns|[aeo]lonians|[aeo]lonian|alonins)?|ss|s)?|Second[\s\xa0]*Th(?:es(?:s(?:al(?:on(?:i(?:(?:[ao]a|io|e)ns|[ao]ns|[ao]n|ns|c(?:i[ae]|a)ns)|(?:(?:oi?|e)a|cie|aia)ns|a(?:ins?|ns))|lonians)|(?:[eo]lonian)?s|[eo]lonian|olonins|elonains)?|(?:al(?:oni[ci]|loni)a|alonio|elonai)ns|[aeo]lonians|[aeo]lonian|alonins)?|ss|s)?))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["1Thess"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:(?:1(?:st)?|I)\.|1(?:st)?|I|First)[\s\xa0]*Thsss)|(?:(?:1(?:st)?|I)[\s\xa0]*Th(?:es(?:s(?:al(?:on(?:i(?:(?:[ao]a|io|e)ns|[ao]ns|[ao]n|ns|c(?:i[ae]|a)ns)|(?:(?:oi?|e)a|cie|aia)ns|a(?:ins?|ns))|lonians)|(?:[eo]lonian)?s|[eo]lonian|olonins|elonains)?|(?:al(?:oni[ci]|loni)a|alonio|elonai)ns|[aeo]lonians|[aeo]lonian|alonins)?|ss|s)?|1Thess|(?:1(?:st)?|I)\.[\s\xa0]*Th(?:es(?:s(?:al(?:on(?:i(?:(?:[ao]a|io|e)ns|[ao]ns|[ao]n|ns|c(?:i[ae]|a)ns)|(?:(?:oi?|e)a|cie|aia)ns|a(?:ins?|ns))|lonians)|(?:[eo]lonian)?s|[eo]lonian|olonins|elonains)?|(?:al(?:oni[ci]|loni)a|alonio|elonai)ns|[aeo]lonians|[aeo]lonian|alonins)?|ss|s)?|First[\s\xa0]*Th(?:es(?:s(?:al(?:on(?:i(?:(?:[ao]a|io|e)ns|[ao]ns|[ao]n|ns|c(?:i[ae]|a)ns)|(?:(?:oi?|e)a|cie|aia)ns|a(?:ins?|ns))|lonians)|(?:[eo]lonian)?s|[eo]lonian|olonins|elonains)?|(?:al(?:oni[ci]|loni)a|alonio|elonai)ns|[aeo]lonians|[aeo]lonian|alonins)?|ss|s)?)|(?:Thes(?:s(?:al(?:on(?:i(?:[ao]ns|[ao]n|ns|(?:[ao]a|io)ns|c(?:i[ae]|a)ns)|(?:cie|ea|oi?a|aia)ns|a(?:ins?|ns))|lonians)|[eo]lonians|[eo]lonian|olonins|elonains)|(?:al(?:oni[ci]|loni)a|alonio|elonai)ns|[aeo]lonians|[aeo]lonian|alonins)))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["2Tim"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:(?:2(?:nd)?|II)\.[\s\xa0]*Timoth?|(?:2(?:nd)?|II)[\s\xa0]*Timoth?|Second[\s\xa0]*Timoth?)y)|(?:(?:2(?:nd)?|II)[\s\xa0]*T(?:imoth|m|im?|omothy|himoth?y)|2Tim|(?:2(?:nd)?|II)\.[\s\xa0]*T(?:imoth|m|im?|omothy|himoth?y)|Second[\s\xa0]*T(?:imoth|m|im?|omothy|himoth?y)))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["1Tim"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:(?:1(?:st)?|I)\.[\s\xa0]*Timoth?|(?:1(?:st)?|I)[\s\xa0]*Timoth?|First[\s\xa0]*Timoth?)y)|(?:(?:1(?:st)?|I)[\s\xa0]*T(?:imoth|m|im?|omothy|himoth?y)|1Tim|(?:1(?:st)?|I)\.[\s\xa0]*T(?:imoth|m|im?|omothy|himoth?y)|First[\s\xa0]*T(?:imoth|m|im?|omothy|himoth?y))|(?:Timothy?))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["Titus"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Ti(?:t(?:us)?)?))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Phlm"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Ph(?:l?mn|l?m|l[ei]mon|ile(?:m(?:on)?)?)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Heb"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:H(?:e(?:b(?:(?:w(?:er|re)|ew[erw]|erw|r(?:rw|we|eww))s|r(?:ew?|w)?s|rew)?|[ew]breww?s)|(?:w[ew]breww?|w?breww?)s)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Jas"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:J(?:a(?:m(?:es?)?|s)?|ms?)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["2Pet"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:2(?:nd)?|II)[\s\xa0]*P(?:e(?:t(?:er?|r)?|r)?|tr?)?|2Pet|(?:2(?:nd)?|II)\.[\s\xa0]*P(?:e(?:t(?:er?|r)?|r)?|tr?)?|Second[\s\xa0]*P(?:e(?:t(?:er?|r)?|r)?|tr?)?))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["1Pet"],
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:1(?:st)?|I)[\s\xa0]*P(?:e(?:t(?:er?|r)?|r)?|tr?)?|1Pet|(?:1(?:st)?|I)\.[\s\xa0]*P(?:e(?:t(?:er?|r)?|r)?|tr?)?|First[\s\xa0]*P(?:e(?:t(?:er?|r)?|r)?|tr?)?)|(?:Peter))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["Jude"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Ju?de))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Tob"],
                apocrypha: !0,
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:T(?:ob(?:i(?:as|t)?|t)?|b)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Jdt"],
                apocrypha: !0,
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:J(?:ud(?:ith?|th?)|d(?:ith?|th?))))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Bar"],
                apocrypha: !0,
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:B(?:ar(?:uch)?|r)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Sus"],
                apocrypha: !0,
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:S(?:us(?:annah|anna)?|hoshana)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["2Macc"],
                apocrypha: !0,
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:2(?:nd)?|II)\.[\s\xa0]*Macc(?:abb(?:e(?:e[es]?|s)?|be[es]?)|cab(?:e(?:e[es]?|s)?|be[es]?))|(?:2(?:nd)?|II)[\s\xa0]*Macc(?:abb(?:e(?:e[es]?|s)?|be[es]?)|cab(?:e(?:e[es]?|s)?|be[es]?))|Second[\s\xa0]*Macc(?:abb(?:e(?:e[es]?|s)?|be[es]?)|cab(?:e(?:e[es]?|s)?|be[es]?)))|(?:2(?:[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?|(?:Mac|[\s\xa0]*M)c|[\s\xa0]*Ma)|(?:2nd|II)[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?|(?:2(?:nd)?|II)\.[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?|Second[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["3Macc"],
                apocrypha: !0,
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:3(?:rd)?|III)\.[\s\xa0]*Macc(?:abb(?:e(?:e[es]?|s)?|be[es]?)|cab(?:e(?:e[es]?|s)?|be[es]?))|(?:3(?:rd)?|III)[\s\xa0]*Macc(?:abb(?:e(?:e[es]?|s)?|be[es]?)|cab(?:e(?:e[es]?|s)?|be[es]?))|Third[\s\xa0]*Macc(?:abb(?:e(?:e[es]?|s)?|be[es]?)|cab(?:e(?:e[es]?|s)?|be[es]?)))|(?:3(?:[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?|(?:Mac|[\s\xa0]*M)c)|(?:3rd|III)[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?|(?:3(?:rd)?|III)\.[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?|Third[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["4Macc"],
                apocrypha: !0,
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:4(?:th)?|IV)\.[\s\xa0]*Macc(?:abb(?:e(?:e[es]?|s)?|be[es]?)|cab(?:e(?:e[es]?|s)?|be[es]?))|(?:4(?:th)?|IV)[\s\xa0]*Macc(?:abb(?:e(?:e[es]?|s)?|be[es]?)|cab(?:e(?:e[es]?|s)?|be[es]?))|Fourth[\s\xa0]*Macc(?:abb(?:e(?:e[es]?|s)?|be[es]?)|cab(?:e(?:e[es]?|s)?|be[es]?)))|(?:4(?:[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?|(?:Mac|[\s\xa0]*M)c)|(?:4th|IV)[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?|(?:4(?:th)?|IV)\.[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?|Fourth[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["1Macc"],
                apocrypha: !0,
                regexp:
                    /(^|[^0-9A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u1e00-\u1eff\u2c60-\u2c7f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua7ff])((?:(?:1(?:st)?|I)\.[\s\xa0]*Macc(?:abb(?:e(?:e[es]?|s)?|be[es]?)|cab(?:e(?:e[es]?|s)?|be[es]?))|(?:1(?:st)?|I)[\s\xa0]*Macc(?:abb(?:e(?:e[es]?|s)?|be[es]?)|cab(?:e(?:e[es]?|s)?|be[es]?))|First[\s\xa0]*Macc(?:abb(?:e(?:e[es]?|s)?|be[es]?)|cab(?:e(?:e[es]?|s)?|be[es]?)))|(?:1(?:[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?|(?:Mac|[\s\xa0]*M)c|[\s\xa0]*Ma)|(?:1st|I)[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?|(?:1(?:st)?|I)\.[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?|First[\s\xa0]*Mac(?:ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|c(?:abe(?:ee?)?s|cabbbe)|cabe(?:ee?)?|cc?)?)|(?:Maccabees))(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]\/"'\*=~\-\u2013\u2014])|$)/gi,
            },
            {
                osis: ["Ezek", "Ezra"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Ez))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Hab", "Hag"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Ha))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Heb", "Hab"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Hb))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["John", "Jonah", "Job", "Josh", "Joel"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Jo))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Jude", "Judg"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:J(?:ud?|d)))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Matt", "Mark", "Mal"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Ma))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Phil", "Phlm"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Ph))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
            {
                osis: ["Zeph", "Zech"],
                regexp: RegExp(
                    "(^|" +
                    n.prototype.regexps.pre_book +
                    ")((?:Ze))(?:(?=[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014])|$)",
                    "gi"
                ),
            },
        ];
        if (!0 === k && "none" === a) return c;
        var f = [];
        var g = 0;
        for (d = c.length; g < d; g++) {
            var l = c[g];
            if (!1 !== k || null == l.apocrypha || !0 !== l.apocrypha)
                "books" === a && (l.regexp = new RegExp(l.regexp.source, "g")),
                    f.push(l);
        }
        return f;
    };
    n.prototype.regexps.books = n.prototype.regexps.get_books(!1, "none");
    var oa;
    (function (k) {
        function a(d, c, f, g) {
            this.message = d;
            this.expected = c;
            this.found = f;
            this.location = g;
            this.name = "SyntaxError";
            "function" === typeof Error.captureStackTrace &&
            Error.captureStackTrace(this, a);
        }

        (function (a, c) {
            function d() {
                this.constructor = a;
            }

            d.prototype = c.prototype;
            a.prototype = new d();
        })(a, Error);
        a.buildMessage = function (a, c) {
            function d(a) {
                return a.charCodeAt(0).toString(16).toUpperCase();
            }

            function g(a) {
                return a
                    .replace(/\\/g, "\\\\")
                    .replace(/"/g, '\\"')
                    .replace(/\0/g, "\\0")
                    .replace(/\t/g, "\\t")
                    .replace(/\n/g, "\\n")
                    .replace(/\r/g, "\\r")
                    .replace(/[\x00-\x0F]/g, function (a) {
                        return "\\x0" + d(a);
                    })
                    .replace(/[\x10-\x1F\x7F-\x9F]/g, function (a) {
                        return "\\x" + d(a);
                    });
            }

            function l(a) {
                return a
                    .replace(/\\/g, "\\\\")
                    .replace(/\]/g, "\\]")
                    .replace(/\^/g, "\\^")
                    .replace(/-/g, "\\-")
                    .replace(/\0/g, "\\0")
                    .replace(/\t/g, "\\t")
                    .replace(/\n/g, "\\n")
                    .replace(/\r/g, "\\r")
                    .replace(/[\x00-\x0F]/g, function (a) {
                        return "\\x0" + d(a);
                    })
                    .replace(/[\x10-\x1F\x7F-\x9F]/g, function (a) {
                        return "\\x" + d(a);
                    });
            }

            var k = {
                literal: function (a) {
                    return '"' + g(a.text) + '"';
                },
                class: function (a) {
                    var d = "",
                        c;
                    for (c = 0; c < a.parts.length; c++)
                        d +=
                            a.parts[c] instanceof Array
                                ? l(a.parts[c][0]) + "-" + l(a.parts[c][1])
                                : l(a.parts[c]);
                    return "[" + (a.inverted ? "^" : "") + d + "]";
                },
                any: function (a) {
                    return "any character";
                },
                end: function (a) {
                    return "end of input";
                },
                other: function (a) {
                    return a.description;
                },
            };
            return (
                "Expected " +
                (function (a) {
                    var d = Array(a.length),
                        c;
                    for (c = 0; c < a.length; c++) {
                        var f = c;
                        var g = a[c];
                        g = k[g.type](g);
                        d[f] = g;
                    }
                    d.sort();
                    if (0 < d.length) {
                        for (a = c = 1; c < d.length; c++)
                            d[c - 1] !== d[c] && ((d[a] = d[c]), a++);
                        d.length = a;
                    }
                    switch (d.length) {
                        case 1:
                            return d[0];
                        case 2:
                            return d[0] + " or " + d[1];
                        default:
                            return d.slice(0, -1).join(", ") + ", or " + d[d.length - 1];
                    }
                })(a) +
                " but " +
                (c ? '"' + g(c) + '"' : "end of input") +
                " found."
            );
        };
        oa = {
            SyntaxError: a,
            parse: function (d, c) {
                function f(b, e) {
                    return {type: "literal", text: b, ignoreCase: e};
                }

                function g(b, e, a) {
                    return {type: "class", parts: b, inverted: e, ignoreCase: a};
                }

                function l(b) {
                    var e = pa[b],
                        a;
                    if (!e) {
                        for (a = b - 1; !pa[a];) a--;
                        e = pa[a];
                        for (e = {line: e.line, column: e.column}; a < b;)
                            10 === d.charCodeAt(a) ? (e.line++, (e.column = 1)) : e.column++,
                                a++;
                        pa[b] = e;
                    }
                    return e;
                }

                function k(b, e) {
                    var a = l(b),
                        d = l(e);
                    return {
                        start: {offset: b, line: a.line, column: a.column},
                        end: {offset: e, line: d.line, column: d.column},
                    };
                }

                function m(b) {
                    e < M || (e > M && ((M = e), (Ha = [])), Ha.push(b));
                }

                function n() {
                    var e = [];
                    var a = qa();
                    a === b &&
                    ((a = v()),
                    a === b &&
                    ((a = ra()),
                    a === b &&
                    ((a = u()),
                    a === b &&
                    ((a = ga()),
                    a === b &&
                    ((a = R()),
                    a === b &&
                    ((a = y()),
                    a === b &&
                    ((a = S()),
                    a === b &&
                    ((a = B()),
                    a === b &&
                    ((a = N()),
                    a === b &&
                    ((a = J()),
                    a === b &&
                    ((a = x()),
                    a === b &&
                    ((a = Z()),
                    a === b &&
                    ((a = O()),
                    a === b &&
                    ((a = T()),
                    a === b &&
                    ((a = z()),
                    a === b &&
                    ((a = aa()),
                    a === b &&
                    ((a = ba()),
                    a === b &&
                    ((a = U()),
                    a === b &&
                    ((a = V()),
                    a === b &&
                    ((a = Ta()),
                    a === b &&
                    ((a = Ua()),
                    a === b &&
                    ((a = C()),
                    a === b &&
                    ((a = ha()),
                    a === b &&
                    ((a = ia()),
                    a === b &&
                    ((a = W()),
                    a === b &&
                    ((a = ca()),
                    a === b &&
                    ((a = K()),
                    a === b &&
                    ((a = L()),
                    a === b &&
                    ((a = D()),
                    a === b &&
                    ((a =
                        A()),
                    a === b &&
                    ((a =
                        Va()),
                    a ===
                    b &&
                    ((a =
                        Wa()),
                    a ===
                    b &&
                    (a =
                        Ia())))))))))))))))))))))))))))))))));
                    if (a !== b)
                        for (; a !== b;)
                            e.push(a),
                                (a = qa()),
                            a === b &&
                            ((a = v()),
                            a === b &&
                            ((a = ra()),
                            a === b &&
                            ((a = u()),
                            a === b &&
                            ((a = ga()),
                            a === b &&
                            ((a = R()),
                            a === b &&
                            ((a = y()),
                            a === b &&
                            ((a = S()),
                            a === b &&
                            ((a = B()),
                            a === b &&
                            ((a = N()),
                            a === b &&
                            ((a = J()),
                            a === b &&
                            ((a = x()),
                            a === b &&
                            ((a = Z()),
                            a === b &&
                            ((a = O()),
                            a === b &&
                            ((a = T()),
                            a === b &&
                            ((a = z()),
                            a === b &&
                            ((a = aa()),
                            a === b &&
                            ((a = ba()),
                            a === b &&
                            ((a = U()),
                            a === b &&
                            ((a = V()),
                            a === b &&
                            ((a = Ta()),
                            a === b &&
                            ((a = Ua()),
                            a === b &&
                            ((a = C()),
                            a === b &&
                            ((a = ha()),
                            a === b &&
                            ((a = ia()),
                            a === b &&
                            ((a = W()),
                            a === b &&
                            ((a = ca()),
                            a === b &&
                            ((a =
                                K()),
                            a === b &&
                            ((a =
                                L()),
                            a ===
                            b &&
                            ((a =
                                D()),
                            a ===
                            b &&
                            ((a =
                                A()),
                            a ===
                            b &&
                            ((a =
                                Va()),
                            a ===
                            b &&
                            ((a =
                                Wa()),
                            a ===
                            b &&
                            (a =
                                Ia())))))))))))))))))))))))))))))))));
                    else e = b;
                    return e;
                }

                function v() {
                    var a = e;
                    var d = ra();
                    d === b &&
                    ((d = qa()),
                    d === b &&
                    ((d = u()),
                    d === b &&
                    ((d = ga()),
                    d === b &&
                    ((d = R()),
                    d === b &&
                    ((d = y()),
                    d === b &&
                    ((d = S()),
                    d === b &&
                    ((d = B()),
                    d === b &&
                    ((d = N()),
                    d === b &&
                    ((d = J()),
                    d === b &&
                    ((d = x()),
                    d === b &&
                    ((d = Z()),
                    d === b &&
                    ((d = O()),
                    d === b &&
                    ((d = T()),
                    d === b &&
                    ((d = z()),
                    d === b &&
                    ((d = aa()),
                    d === b &&
                    ((d = ba()),
                    d === b &&
                    ((d = U()),
                    d === b &&
                    ((d = V()),
                    d === b &&
                    (d = Ia())))))))))))))))))));
                    if (d !== b) {
                        var c = [];
                        var h = e;
                        var f = C();
                        f === b && (f = null);
                        if (f !== b) {
                            var g = t();
                            g !== b ? (h = f = [f, g]) : ((e = h), (h = b));
                        } else (e = h), (h = b);
                        if (h !== b)
                            for (; h !== b;)
                                c.push(h),
                                    (h = e),
                                    (f = C()),
                                f === b && (f = null),
                                    f !== b
                                        ? ((g = t()),
                                            g !== b ? (h = f = [f, g]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b));
                        else c = b;
                        c !== b
                            ? ((q = a),
                                (a = c),
                                a.unshift([d]),
                                (a = d = {type: "sequence", value: a, indices: [q, e - 1]}))
                            : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function t() {
                    var a = e;
                    if (40 === d.charCodeAt(e)) {
                        var c = Ga;
                        e++;
                    } else (c = b), 0 === p && m(ac);
                    if (c !== b)
                        if (((c = w()), c !== b))
                            if (((c = C()), c === b && (c = null), c !== b))
                                if (((c = t()), c !== b)) {
                                    var f = [];
                                    var h = e;
                                    var r = C();
                                    r === b && (r = null);
                                    if (r !== b) {
                                        var g = t();
                                        g !== b ? (h = r = [r, g]) : ((e = h), (h = b));
                                    } else (e = h), (h = b);
                                    for (; h !== b;)
                                        f.push(h),
                                            (h = e),
                                            (r = C()),
                                        r === b && (r = null),
                                            r !== b
                                                ? ((g = t()),
                                                    g !== b ? (h = r = [r, g]) : ((e = h), (h = b)))
                                                : ((e = h), (h = b));
                                    f !== b
                                        ? ((h = w()),
                                            h !== b
                                                ? (41 === d.charCodeAt(e)
                                                    ? ((r = bc), e++)
                                                    : ((r = b), 0 === p && m(cc)),
                                                    r !== b
                                                        ? ((q = a),
                                                            (a = f),
                                                        "undefined" === typeof a && (a = []),
                                                            a.unshift([c]),
                                                            (a = c =
                                                                {
                                                                    type: "sequence_post_enclosed",
                                                                    value: a,
                                                                    indices: [q, e - 1],
                                                                }))
                                                        : ((e = a), (a = b)))
                                                : ((e = a), (a = b)))
                                        : ((e = a), (a = b));
                                } else (e = a), (a = b);
                            else (e = a), (a = b);
                        else (e = a), (a = b);
                    else (e = a), (a = b);
                    a === b &&
                    ((a = ra()),
                    a === b &&
                    ((a = qa()),
                    a === b &&
                    ((a = u()),
                    a === b &&
                    ((a = ga()),
                    a === b &&
                    ((a = R()),
                    a === b &&
                    ((a = y()),
                    a === b &&
                    ((a = S()),
                    a === b &&
                    ((a = B()),
                    a === b &&
                    ((a = N()),
                    a === b &&
                    ((a = J()),
                    a === b &&
                    ((a = x()),
                    a === b &&
                    ((a = Z()),
                    a === b &&
                    ((a = O()),
                    a === b &&
                    ((a = T()),
                    a === b &&
                    ((a = z()),
                    a === b &&
                    ((a = aa()),
                    a === b &&
                    ((a = ba()),
                    a === b &&
                    ((a = U()),
                    a === b &&
                    ((a = V()),
                    a === b &&
                    ((a = ha()),
                    a === b &&
                    ((a = ia()),
                    a === b &&
                    ((a = W()),
                    a === b &&
                    ((a = ca()),
                    a === b &&
                    ((a = K()),
                    a === b &&
                    ((a = L()),
                    a === b &&
                    ((a = D()),
                    a === b &&
                    (a =
                        A())))))))))))))))))))))))))));
                    return a;
                }

                function u() {
                    var a = e;
                    var d = R();
                    if (
                        d === b &&
                        ((d = y()),
                        d === b &&
                        ((d = S()),
                        d === b &&
                        ((d = B()),
                        d === b &&
                        ((d = N()),
                        d === b &&
                        ((d = J()),
                        d === b &&
                        ((d = x()),
                        d === b &&
                        ((d = Z()), d === b && ((d = O()), d === b))))))))
                    ) {
                        d = e;
                        var c = z();
                        if (c !== b) {
                            var h = e;
                            p++;
                            var f = e;
                            var g = X();
                            if (g !== b) {
                                var m = R();
                                m === b &&
                                ((m = y()),
                                m === b &&
                                ((m = S()),
                                m === b &&
                                ((m = B()),
                                m === b &&
                                ((m = N()),
                                m === b &&
                                ((m = J()),
                                m === b &&
                                ((m = x()),
                                m === b && ((m = O()), m === b && (m = z()))))))));
                                m !== b ? (f = g = [g, m]) : ((e = f), (f = b));
                            } else (e = f), (f = b);
                            p--;
                            f !== b ? ((e = h), (h = void 0)) : (h = b);
                            h !== b ? (d = c = [c, h]) : ((e = d), (d = b));
                        } else (e = d), (d = b);
                        d === b &&
                        ((d = aa()),
                        d === b &&
                        ((d = ba()),
                        d === b &&
                        ((d = T()),
                        d === b &&
                        ((d = U()),
                        d === b &&
                        ((d = V()),
                        d === b &&
                        ((d = ha()),
                        d === b &&
                        ((d = ia()),
                        d === b &&
                        ((d = W()),
                        d === b &&
                        ((d = ca()),
                        d === b &&
                        ((d = K()),
                        d === b &&
                        ((d = L()),
                        d === b &&
                        ((d = D()),
                        d === b && (d = A())))))))))))));
                    }
                    d !== b
                        ? ((c = X()),
                            c !== b
                                ? ((h = ga()),
                                h === b &&
                                ((h = R()),
                                h === b &&
                                ((h = y()),
                                h === b &&
                                ((h = S()),
                                h === b &&
                                ((h = B()),
                                h === b &&
                                ((h = N()),
                                h === b &&
                                ((h = J()),
                                h === b &&
                                ((h = x()),
                                h === b &&
                                ((h = Z()),
                                h === b &&
                                ((h = O()),
                                h === b &&
                                ((h = z()),
                                h === b &&
                                ((h = aa()),
                                h === b &&
                                ((h = ba()),
                                h === b &&
                                ((h = T()),
                                h === b &&
                                ((h = U()),
                                h === b &&
                                ((h = V()),
                                h === b &&
                                ((h = ha()),
                                h === b &&
                                ((h = ia()),
                                h === b &&
                                ((h = W()),
                                h === b &&
                                ((h = K()),
                                h === b &&
                                ((h = L()),
                                h === b &&
                                ((h = ca()),
                                h === b &&
                                ((h = D()),
                                h === b &&
                                (h =
                                    A()))))))))))))))))))))))),
                                    h !== b
                                        ? ((q = a),
                                            (a = d),
                                        a.length && 2 === a.length && (a = a[0]),
                                            (a = d =
                                                {type: "range", value: [a, h], indices: [q, e - 1]}))
                                        : ((e = a), (a = b)))
                                : ((e = a), (a = b)))
                        : ((e = a), (a = b));
                    return a;
                }

                function z() {
                    var a = e;
                    if (31 === d.charCodeAt(e)) {
                        var c = ja;
                        e++;
                    } else (c = b), 0 === p && m(ka);
                    if (c !== b)
                        if (((c = la()), c !== b)) {
                            var f = e;
                            if (47 === d.charCodeAt(e)) {
                                var h = dc;
                                e++;
                            } else (h = b), 0 === p && m(ec);
                            if (h !== b) {
                                if (fc.test(d.charAt(e))) {
                                    var r = d.charAt(e);
                                    e++;
                                } else (r = b), 0 === p && m(gc);
                                r !== b ? (f = h = [h, r]) : ((e = f), (f = b));
                            } else (e = f), (f = b);
                            f === b && (f = null);
                            f !== b
                                ? (31 === d.charCodeAt(e)
                                    ? ((h = ja), e++)
                                    : ((h = b), 0 === p && m(ka)),
                                    h !== b ? ((q = a), (a = c = Xa(c))) : ((e = a), (a = b)))
                                : ((e = a), (a = b));
                        } else (e = a), (a = b);
                    else (e = a), (a = b);
                    return a;
                }

                function x() {
                    var a = e;
                    var d = z();
                    if (d !== b) {
                        var c = e;
                        var h = I();
                        if (h !== b) {
                            var f = e;
                            p++;
                            var g = e;
                            var m = D();
                            if (m !== b) {
                                var k = H();
                                if (k !== b) {
                                    var l = A();
                                    l !== b ? (g = m = [m, k, l]) : ((e = g), (g = b));
                                } else (e = g), (g = b);
                            } else (e = g), (g = b);
                            p--;
                            g !== b ? ((e = f), (f = void 0)) : (f = b);
                            f !== b ? (c = h = [h, f]) : ((e = c), (c = b));
                        } else (e = c), (c = b);
                        if (c === b) {
                            c = [];
                            h = H();
                            if (h !== b) for (; h !== b;) c.push(h), (h = H());
                            else c = b;
                            if (c === b) {
                                c = [];
                                h = da();
                                if (h !== b) for (; h !== b;) c.push(h), (h = da());
                                else c = b;
                                if (c === b) {
                                    c = [];
                                    h = X();
                                    if (h !== b) for (; h !== b;) c.push(h), (h = X());
                                    else c = b;
                                    c === b && (c = w());
                                }
                            }
                        }
                        c !== b
                            ? ((h = D()),
                                h !== b ? ((q = a), (a = d = Ya(d, h))) : ((e = a), (a = b)))
                            : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function y() {
                    var a = e;
                    var d = J();
                    d === b && (d = x());
                    if (d !== b) {
                        var c = Ja();
                        c !== b
                            ? ((q = a),
                                (a = d =
                                    {type: "bc_title", value: [d, c], indices: [q, e - 1]}))
                            : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function B() {
                    var a = e;
                    var c = J();
                    c === b && (c = x());
                    if (c !== b) {
                        var f = e;
                        p++;
                        var h = e;
                        if (46 === d.charCodeAt(e)) {
                            var r = F;
                            e++;
                        } else (r = b), 0 === p && m(G);
                        if (r !== b) {
                            var g = I();
                            if (g !== b) {
                                var k = A();
                                k !== b ? (h = r = [r, g, k]) : ((e = h), (h = b));
                            } else (e = h), (h = b);
                        } else (e = h), (h = b);
                        h === b &&
                        ((h = e),
                            (r = C()),
                        r === b && (r = null),
                            r !== b
                                ? ((g = I()),
                                    g !== b
                                        ? ((k = W()),
                                            k !== b ? (h = r = [r, g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)))
                                : ((e = h), (h = b)));
                        p--;
                        h === b ? (f = void 0) : ((e = f), (f = b));
                        f !== b
                            ? ((h = e),
                                (r = H()),
                            r === b && (r = C()),
                            r === b && (r = null),
                                r !== b
                                    ? ((g = I()), g !== b ? (h = r = [r, g]) : ((e = h), (h = b)))
                                    : ((e = h), (h = b)),
                            h === b && (h = H()),
                                h !== b
                                    ? ((r = K()),
                                    r === b && (r = A()),
                                        r !== b
                                            ? ((q = a), (a = c = ma(c, r)))
                                            : ((e = a), (a = b)))
                                    : ((e = a), (a = b)))
                            : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function N() {
                    var a = e;
                    var d = J();
                    d === b && (d = x());
                    if (d !== b) {
                        var c = da();
                        if (c !== b)
                            if (((c = K()), c === b && (c = A()), c !== b)) {
                                var h = e;
                                p++;
                                var f = e;
                                var g = H();
                                if (g !== b) {
                                    var m = A();
                                    m !== b ? (f = g = [g, m]) : ((e = f), (f = b));
                                } else (e = f), (f = b);
                                p--;
                                f === b ? (h = void 0) : ((e = h), (h = b));
                                h !== b ? ((q = a), (a = d = ma(d, c))) : ((e = a), (a = b));
                            } else (e = a), (a = b);
                        else (e = a), (a = b);
                    } else (e = a), (a = b);
                    return a;
                }

                function R() {
                    var a;
                    var c = (a = e);
                    var f = z();
                    if (f !== b) {
                        var h = w();
                        h !== b
                            ? (44 === d.charCodeAt(e)
                                ? ((h = sa), e++)
                                : ((h = b), 0 === p && m(ta)),
                                h !== b
                                    ? ((h = w()),
                                        h !== b
                                            ? ((h = D()),
                                                h !== b
                                                    ? ((q = c), (c = f = Ya(f, h)))
                                                    : ((e = c), (c = b)))
                                            : ((e = c), (c = b)))
                                    : ((e = c), (c = b)))
                            : ((e = c), (c = b));
                    } else (e = c), (c = b);
                    if (c !== b)
                        if (((f = w()), f !== b))
                            if (
                                (44 === d.charCodeAt(e)
                                    ? ((f = sa), e++)
                                    : ((f = b), 0 === p && m(ta)),
                                f !== b)
                            )
                                if (((f = w()), f !== b))
                                    if (((f = K()), f === b && (f = A()), f !== b)) {
                                        h = e;
                                        p++;
                                        var r = e;
                                        var g = H();
                                        if (g !== b) {
                                            var k = A();
                                            k !== b ? (r = g = [g, k]) : ((e = r), (r = b));
                                        } else (e = r), (r = b);
                                        p--;
                                        r === b ? (h = void 0) : ((e = h), (h = b));
                                        h !== b
                                            ? ((q = a), (a = c = ma(c, f)))
                                            : ((e = a), (a = b));
                                    } else (e = a), (a = b);
                                else (e = a), (a = b);
                            else (e = a), (a = b);
                        else (e = a), (a = b);
                    else (e = a), (a = b);
                    return a;
                }

                function qa() {
                    var a = e;
                    var c = z();
                    if (c !== b) {
                        if (45 === d.charCodeAt(e)) {
                            var f = Ka;
                            e++;
                        } else (f = b), 0 === p && m(La);
                        f === b && (f = Y());
                        f === b && (f = null);
                        if (f !== b)
                            if (((f = D()), f !== b)) {
                                if (45 === d.charCodeAt(e)) {
                                    var h = Ka;
                                    e++;
                                } else (h = b), 0 === p && m(La);
                                if (h !== b)
                                    if (((h = A()), h !== b)) {
                                        if (45 === d.charCodeAt(e)) {
                                            var r = Ka;
                                            e++;
                                        } else (r = b), 0 === p && m(La);
                                        r !== b
                                            ? ((r = A()),
                                                r !== b
                                                    ? ((q = a),
                                                        (a = c =
                                                            {
                                                                type: "range",
                                                                value: [
                                                                    {
                                                                        type: "bcv",
                                                                        value: [
                                                                            {
                                                                                type: "bc",
                                                                                value: [c, f],
                                                                                indices: [c.indices[0], f.indices[1]],
                                                                            },
                                                                            h,
                                                                        ],
                                                                        indices: [c.indices[0], h.indices[1]],
                                                                    },
                                                                    r,
                                                                ],
                                                                indices: [q, e - 1],
                                                            }))
                                                    : ((e = a), (a = b)))
                                            : ((e = a), (a = b));
                                    } else (e = a), (a = b);
                                else (e = a), (a = b);
                            } else (e = a), (a = b);
                        else (e = a), (a = b);
                    } else (e = a), (a = b);
                    return a;
                }

                function O() {
                    var a = e;
                    var d = z();
                    if (d !== b) {
                        var c = [];
                        var h = H();
                        if (h !== b) for (; h !== b;) c.push(h), (h = H());
                        else c = b;
                        if (c === b) {
                            c = [];
                            h = da();
                            if (h !== b) for (; h !== b;) c.push(h), (h = da());
                            else c = b;
                            if (c === b) {
                                c = [];
                                h = X();
                                if (h !== b) for (; h !== b;) c.push(h), (h = X());
                                else c = b;
                                if (c === b) {
                                    c = e;
                                    h = [];
                                    var f = C();
                                    if (f !== b) for (; f !== b;) h.push(f), (f = C());
                                    else h = b;
                                    if (h !== b) {
                                        f = e;
                                        p++;
                                        var g = I();
                                        p--;
                                        g !== b ? ((e = f), (f = void 0)) : (f = b);
                                        f !== b ? (c = h = [h, f]) : ((e = c), (c = b));
                                    } else (e = c), (c = b);
                                    c === b && (c = w());
                                }
                            }
                        }
                        c !== b
                            ? ((h = K()),
                            h === b && (h = A()),
                                h !== b
                                    ? ((q = a),
                                        (a = d =
                                            {type: "bv", value: [d, h], indices: [q, e - 1]}))
                                    : ((e = a), (a = b)))
                            : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function U() {
                    var a = e;
                    var d = na();
                    if (d !== b)
                        if (((d = D()), d !== b)) {
                            var c = Ma();
                            c === b && (c = null);
                            c !== b
                                ? ((c = z()),
                                    c !== b ? ((q = a), (a = d = Za(d, c))) : ((e = a), (a = b)))
                                : ((e = a), (a = b));
                        } else (e = a), (a = b);
                    else (e = a), (a = b);
                    return a;
                }

                function ra() {
                    var a = e;
                    var d = na();
                    if (d !== b)
                        if (((d = D()), d !== b)) {
                            var c = X();
                            if (c !== b)
                                if (((c = D()), c !== b)) {
                                    var h = Ma();
                                    h === b && (h = null);
                                    h !== b
                                        ? ((h = z()),
                                            h !== b
                                                ? ((q = a),
                                                    (a = d =
                                                        {
                                                            type: "cb_range",
                                                            value: [h, d, c],
                                                            indices: [q, e - 1],
                                                        }))
                                                : ((e = a), (a = b)))
                                        : ((e = a), (a = b));
                                } else (e = a), (a = b);
                            else (e = a), (a = b);
                        } else (e = a), (a = b);
                    else (e = a), (a = b);
                    return a;
                }

                function aa() {
                    var a = e;
                    var d = U();
                    if (d !== b) {
                        var c = C();
                        c === b && (c = null);
                        c !== b
                            ? ((c = I()),
                                c !== b
                                    ? ((c = A()),
                                        c !== b
                                            ? ((q = a), (a = d = ma(d, c)))
                                            : ((e = a), (a = b)))
                                    : ((e = a), (a = b)))
                            : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function V() {
                    var a = e;
                    var c = D();
                    if (c !== b) {
                        if (d.substr(e, 2) === $a) {
                            var f = $a;
                            e += 2;
                        } else (f = b), 0 === p && m(hc);
                        f === b &&
                        (d.substr(e, 2) === ab
                            ? ((f = ab), (e += 2))
                            : ((f = b), 0 === p && m(ic)),
                        f === b &&
                        (d.substr(e, 2) === bb
                            ? ((f = bb), (e += 2))
                            : ((f = b), 0 === p && m(jc))));
                        f !== b
                            ? ((f = na()),
                                f !== b
                                    ? ((f = Ma()),
                                    f === b && (f = null),
                                        f !== b
                                            ? ((f = z()),
                                                f !== b
                                                    ? ((q = a), (a = c = Za(c, f)))
                                                    : ((e = a), (a = b)))
                                            : ((e = a), (a = b)))
                                    : ((e = a), (a = b)))
                            : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function ba() {
                    var a = e;
                    var d = V();
                    if (d !== b) {
                        var c = C();
                        c === b && (c = null);
                        c !== b
                            ? ((c = I()),
                                c !== b
                                    ? ((c = A()),
                                        c !== b
                                            ? ((q = a), (a = d = ma(d, c)))
                                            : ((e = a), (a = b)))
                                    : ((e = a), (a = b)))
                            : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function T() {
                    var a = e;
                    if (31 === d.charCodeAt(e)) {
                        var c = ja;
                        e++;
                    } else (c = b), 0 === p && m(ka);
                    if (c !== b)
                        if (((c = la()), c !== b)) {
                            if (d.substr(e, 3) === cb) {
                                var f = cb;
                                e += 3;
                            } else (f = b), 0 === p && m(kc);
                            f !== b
                                ? ((q = a),
                                    (a = c =
                                        {type: "c_psalm", value: c.value, indices: [q, e - 1]}))
                                : ((e = a), (a = b));
                        } else (e = a), (a = b);
                    else (e = a), (a = b);
                    return a;
                }

                function Z() {
                    var a = e;
                    var d = T();
                    if (d !== b) {
                        var c = C();
                        c === b && (c = null);
                        c !== b
                            ? ((c = I()),
                                c !== b
                                    ? ((c = A()),
                                        c !== b
                                            ? ((q = a),
                                                (a = d =
                                                    {
                                                        type: "cv_psalm",
                                                        value: [d, c],
                                                        indices: [q, e - 1],
                                                    }))
                                            : ((e = a), (a = b)))
                                    : ((e = a), (a = b)))
                            : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function ha() {
                    var a = e;
                    var d = na();
                    if (d !== b)
                        if (((d = D()), d !== b)) {
                            var c = Ja();
                            c !== b
                                ? ((q = a),
                                    (a = d =
                                        {type: "c_title", value: [d, c], indices: [q, e - 1]}))
                                : ((e = a), (a = b));
                        } else (e = a), (a = b);
                    else (e = a), (a = b);
                    return a;
                }

                function W() {
                    var a = e;
                    var c = I();
                    c === b && (c = null);
                    if (c !== b)
                        if (((c = D()), c !== b)) {
                            var f = e;
                            p++;
                            var h = e;
                            if (46 === d.charCodeAt(e)) {
                                var r = F;
                                e++;
                            } else (r = b), 0 === p && m(G);
                            if (r !== b) {
                                var g = I();
                                if (g !== b) {
                                    var k = A();
                                    k !== b ? (h = r = [r, g, k]) : ((e = h), (h = b));
                                } else (e = h), (h = b);
                            } else (e = h), (h = b);
                            p--;
                            h === b ? (f = void 0) : ((e = f), (f = b));
                            f !== b
                                ? ((h = e),
                                    (r = H()),
                                r === b && (r = null),
                                    r !== b
                                        ? ((g = I()),
                                            g !== b ? (h = r = [r, g]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)),
                                h === b && (h = H()),
                                    h !== b
                                        ? ((r = K()),
                                        r === b && (r = A()),
                                            r !== b
                                                ? ((q = a), (a = c = db(c, r)))
                                                : ((e = a), (a = b)))
                                        : ((e = a), (a = b)))
                                : ((e = a), (a = b));
                        } else (e = a), (a = b);
                    else (e = a), (a = b);
                    return a;
                }

                function ca() {
                    var a = e;
                    var d = D();
                    if (d !== b) {
                        var c = da();
                        if (c !== b)
                            if (((c = K()), c === b && (c = A()), c !== b)) {
                                var f = e;
                                p++;
                                var g = e;
                                var m = H();
                                if (m !== b) {
                                    var k = A();
                                    k !== b ? (g = m = [m, k]) : ((e = g), (g = b));
                                } else (e = g), (g = b);
                                p--;
                                g === b ? (f = void 0) : ((e = f), (f = b));
                                f !== b ? ((q = a), (a = d = db(d, c))) : ((e = a), (a = b));
                            } else (e = a), (a = b);
                        else (e = a), (a = b);
                    } else (e = a), (a = b);
                    return a;
                }

                function D() {
                    var a = e;
                    var d = na();
                    d === b && (d = null);
                    d !== b
                        ? ((d = L()),
                            d !== b
                                ? ((q = a),
                                    (a = d = {type: "c", value: [d], indices: [q, e - 1]}))
                                : ((e = a), (a = b)))
                        : ((e = a), (a = b));
                    return a;
                }

                function ga() {
                    var a = e;
                    var c = B();
                    c === b &&
                    ((c = N()),
                    c === b &&
                    ((c = x()),
                    c === b &&
                    ((c = O()),
                    c === b &&
                    ((c = W()),
                    c === b &&
                    ((c = ca()),
                    c === b &&
                    ((c = L()),
                    c === b && ((c = D()), c === b && (c = A()))))))));
                    if (c !== b) {
                        var f = w();
                        if (f !== b) {
                            f = e;
                            if (d.substr(e, 2) === ua) {
                                var h = ua;
                                e += 2;
                            } else (h = b), 0 === p && m(eb);
                            if (h !== b) {
                                var g = e;
                                p++;
                                if (va.test(d.charAt(e))) {
                                    var k = d.charAt(e);
                                    e++;
                                } else (k = b), 0 === p && m(wa);
                                p--;
                                k === b ? (g = void 0) : ((e = g), (g = b));
                                g !== b ? (f = h = [h, g]) : ((e = f), (f = b));
                            } else (e = f), (f = b);
                            f === b &&
                            ((f = e),
                                102 === d.charCodeAt(e)
                                    ? ((h = fb), e++)
                                    : ((h = b), 0 === p && m(gb)),
                                h !== b
                                    ? ((g = e),
                                        p++,
                                        va.test(d.charAt(e))
                                            ? ((k = d.charAt(e)), e++)
                                            : ((k = b), 0 === p && m(wa)),
                                        p--,
                                        k === b ? (g = void 0) : ((e = g), (g = b)),
                                        g !== b ? (f = h = [h, g]) : ((e = f), (f = b)))
                                    : ((e = f), (f = b)));
                            f !== b
                                ? ((h = E()),
                                h === b && (h = null),
                                    h !== b
                                        ? ((g = e),
                                            p++,
                                            Na.test(d.charAt(e))
                                                ? ((k = d.charAt(e)), e++)
                                                : ((k = b), 0 === p && m(Oa)),
                                            p--,
                                            k === b ? (g = void 0) : ((e = g), (g = b)),
                                            g !== b
                                                ? ((q = a),
                                                    (a = c =
                                                        {type: "ff", value: [c], indices: [q, e - 1]}))
                                                : ((e = a), (a = b)))
                                        : ((e = a), (a = b)))
                                : ((e = a), (a = b));
                        } else (e = a), (a = b);
                    } else (e = a), (a = b);
                    return a;
                }

                function ia() {
                    var a = e;
                    var d = L();
                    if (d !== b) {
                        var c = Ja();
                        c !== b
                            ? ((q = a),
                                (a = d =
                                    {
                                        type: "integer_title",
                                        value: [d, c],
                                        indices: [q, e - 1],
                                    }))
                            : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function Ia() {
                    var a = e;
                    if (31 === d.charCodeAt(e)) {
                        var c = ja;
                        e++;
                    } else (c = b), 0 === p && m(ka);
                    if (c !== b)
                        if (((c = la()), c !== b)) {
                            if (d.substr(e, 3) === hb) {
                                var f = hb;
                                e += 3;
                            } else (f = b), 0 === p && m(lc);
                            f !== b
                                ? ((q = a),
                                    (a = c =
                                        {type: "context", value: c.value, indices: [q, e - 1]}))
                                : ((e = a), (a = b));
                        } else (e = a), (a = b);
                    else (e = a), (a = b);
                    return a;
                }

                function J() {
                    var a;
                    var c = (a = e);
                    if (31 === d.charCodeAt(e)) {
                        var f = ja;
                        e++;
                    } else (f = b), 0 === p && m(ka);
                    if (f !== b)
                        if (((f = la()), f !== b)) {
                            if (d.substr(e, 3) === ib) {
                                var h = ib;
                                e += 3;
                            } else (h = b), 0 === p && m(mc);
                            h !== b ? ((q = c), (c = f = Xa(f))) : ((e = c), (c = b));
                        } else (e = c), (c = b);
                    else (e = c), (c = b);
                    c !== b
                        ? (d.substr(e, 2) === jb
                            ? ((f = jb), (e += 2))
                            : ((f = b), 0 === p && m(nc)),
                            f !== b
                                ? ((f = e),
                                    p++,
                                    Pa.test(d.charAt(e))
                                        ? ((h = d.charAt(e)), e++)
                                        : ((h = b), 0 === p && m(Qa)),
                                    p--,
                                    h === b ? (f = void 0) : ((e = f), (f = b)),
                                    f !== b
                                        ? ((q = a),
                                            (a = c =
                                                {
                                                    type: "bc",
                                                    value: [
                                                        c,
                                                        {
                                                            type: "c",
                                                            value: [
                                                                {
                                                                    type: "integer",
                                                                    value: 151,
                                                                    indices: [e - 2, e - 1],
                                                                },
                                                            ],
                                                            indices: [e - 2, e - 1],
                                                        },
                                                    ],
                                                    indices: [q, e - 1],
                                                }))
                                        : ((e = a), (a = b)))
                                : ((e = a), (a = b)))
                        : ((e = a), (a = b));
                    return a;
                }

                function S() {
                    var a = e;
                    var c = J();
                    if (c !== b) {
                        if (46 === d.charCodeAt(e)) {
                            var f = F;
                            e++;
                        } else (f = b), 0 === p && m(G);
                        f !== b
                            ? ((f = L()),
                                f !== b
                                    ? ((q = a),
                                        (a = c =
                                            {
                                                type: "bcv",
                                                value: [
                                                    c,
                                                    {
                                                        type: "v",
                                                        value: [f],
                                                        indices: [f.indices[0], f.indices[1]],
                                                    },
                                                ],
                                                indices: [q, e - 1],
                                            }))
                                    : ((e = a), (a = b)))
                            : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function K() {
                    var a = e;
                    var c = I();
                    c === b && (c = null);
                    if (c !== b)
                        if (((c = L()), c !== b)) {
                            var f = w();
                            if (f !== b) {
                                f = e;
                                p++;
                                var h = e;
                                if (d.substr(e, 2) === ua) {
                                    var g = ua;
                                    e += 2;
                                } else (g = b), 0 === p && m(eb);
                                if (g !== b) {
                                    var k = e;
                                    p++;
                                    if (va.test(d.charAt(e))) {
                                        var l = d.charAt(e);
                                        e++;
                                    } else (l = b), 0 === p && m(wa);
                                    p--;
                                    l === b ? (k = void 0) : ((e = k), (k = b));
                                    k !== b ? (h = g = [g, k]) : ((e = h), (h = b));
                                } else (e = h), (h = b);
                                h === b &&
                                ((h = e),
                                    102 === d.charCodeAt(e)
                                        ? ((g = fb), e++)
                                        : ((g = b), 0 === p && m(gb)),
                                    g !== b
                                        ? ((k = e),
                                            p++,
                                            va.test(d.charAt(e))
                                                ? ((l = d.charAt(e)), e++)
                                                : ((l = b), 0 === p && m(wa)),
                                            p--,
                                            l === b ? (k = void 0) : ((e = k), (k = b)),
                                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)));
                                p--;
                                h === b ? (f = void 0) : ((e = f), (f = b));
                                f !== b
                                    ? (oc.test(d.charAt(e))
                                        ? ((h = d.charAt(e)), e++)
                                        : ((h = b), 0 === p && m(pc)),
                                        h !== b
                                            ? ((g = e),
                                                p++,
                                                Na.test(d.charAt(e))
                                                    ? ((k = d.charAt(e)), e++)
                                                    : ((k = b), 0 === p && m(Oa)),
                                                p--,
                                                k === b ? (g = void 0) : ((e = g), (g = b)),
                                                g !== b
                                                    ? ((q = a), (a = c = kb(c)))
                                                    : ((e = a), (a = b)))
                                            : ((e = a), (a = b)))
                                    : ((e = a), (a = b));
                            } else (e = a), (a = b);
                        } else (e = a), (a = b);
                    else (e = a), (a = b);
                    return a;
                }

                function A() {
                    var a = e;
                    var d = I();
                    d === b && (d = null);
                    d !== b
                        ? ((d = L()),
                            d !== b ? ((q = a), (a = d = kb(d))) : ((e = a), (a = b)))
                        : ((e = a), (a = b));
                    return a;
                }

                function na() {
                    var a = e;
                    var c = w();
                    if (c !== b) {
                        c = e;
                        if (d.substr(e, 2) === lb) {
                            var f = lb;
                            e += 2;
                        } else (f = b), 0 === p && m(qc);
                        if (f !== b) {
                            if (d.substr(e, 6) === mb) {
                                var h = mb;
                                e += 6;
                            } else (h = b), 0 === p && m(rc);
                            if (
                                h === b &&
                                (d.substr(e, 5) === nb
                                    ? ((h = nb), (e += 5))
                                    : ((h = b), 0 === p && m(sc)),
                                h === b)
                            ) {
                                h = e;
                                if (d.substr(e, 4) === ob) {
                                    var g = ob;
                                    e += 4;
                                } else (g = b), 0 === p && m(tc);
                                if (g !== b) {
                                    var k = E();
                                    k === b && (k = null);
                                    k !== b ? (h = g = [g, k]) : ((e = h), (h = b));
                                } else (e = h), (h = b);
                                h === b &&
                                ((h = e),
                                    d.substr(e, 3) === pb
                                        ? ((g = pb), (e += 3))
                                        : ((g = b), 0 === p && m(uc)),
                                    g !== b
                                        ? ((k = E()),
                                        k === b && (k = null),
                                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)),
                                h === b &&
                                ((h = e),
                                    d.substr(e, 3) === qb
                                        ? ((g = qb), (e += 3))
                                        : ((g = b), 0 === p && m(vc)),
                                    g !== b
                                        ? ((k = E()),
                                        k === b && (k = null),
                                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)),
                                h === b &&
                                ((h = e),
                                    d.substr(e, 3) === rb
                                        ? ((g = rb), (e += 3))
                                        : ((g = b), 0 === p && m(wc)),
                                    g !== b
                                        ? ((k = E()),
                                        k === b && (k = null),
                                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)),
                                h === b &&
                                ((h = e),
                                    d.substr(e, 2) === sb
                                        ? ((g = sb), (e += 2))
                                        : ((g = b), 0 === p && m(xc)),
                                    g !== b
                                        ? ((k = E()),
                                        k === b && (k = null),
                                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)),
                                h === b &&
                                ((h = e),
                                    112 === d.charCodeAt(e)
                                        ? ((g = yc), e++)
                                        : ((g = b), 0 === p && m(zc)),
                                    g !== b
                                        ? ((k = E()),
                                        k === b && (k = null),
                                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)),
                                h === b &&
                                ((h = e),
                                    115 === d.charCodeAt(e)
                                        ? ((g = tb), e++)
                                        : ((g = b), 0 === p && m(ub)),
                                    g !== b
                                        ? ((k = E()),
                                        k === b && (k = null),
                                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)),
                                h === b &&
                                ((h = e),
                                    97 === d.charCodeAt(e)
                                        ? ((g = Ac), e++)
                                        : ((g = b), 0 === p && m(Bc)),
                                    g !== b
                                        ? ((k = E()),
                                        k === b && (k = null),
                                            k !== b
                                                ? (h = g = [g, k])
                                                : ((e = h), (h = b)))
                                        : ((e = h), (h = b)),
                                h === b &&
                                ((h = E()), h === b && (h = null)))))))));
                            }
                            h !== b ? (c = f = [f, h]) : ((e = c), (c = b));
                        } else (e = c), (c = b);
                        c !== b
                            ? ((f = w()),
                                f !== b
                                    ? ((q = a), (a = c = {type: "c_explicit"}))
                                    : ((e = a), (a = b)))
                            : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function I() {
                    var a = e;
                    var c = w();
                    if (c !== b) {
                        c = e;
                        if (118 === d.charCodeAt(e)) {
                            var f = vb;
                            e++;
                        } else (f = b), 0 === p && m(wb);
                        if (f !== b) {
                            if (d.substr(e, 5) === xb) {
                                var h = xb;
                                e += 5;
                            } else (h = b), 0 === p && m(Cc);
                            if (
                                h === b &&
                                (d.substr(e, 4) === yb
                                    ? ((h = yb), (e += 4))
                                    : ((h = b), 0 === p && m(Dc)),
                                h === b)
                            ) {
                                h = e;
                                if (d.substr(e, 2) === zb) {
                                    var g = zb;
                                    e += 2;
                                } else (g = b), 0 === p && m(Ec);
                                if (g !== b) {
                                    var k = E();
                                    k === b && (k = null);
                                    k !== b ? (h = g = [g, k]) : ((e = h), (h = b));
                                } else (e = h), (h = b);
                                h === b &&
                                ((h = e),
                                    d.substr(e, 2) === Ab
                                        ? ((g = Ab), (e += 2))
                                        : ((g = b), 0 === p && m(Fc)),
                                    g !== b
                                        ? ((k = E()),
                                        k === b && (k = null),
                                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)),
                                h === b &&
                                ((h = e),
                                    115 === d.charCodeAt(e)
                                        ? ((g = tb), e++)
                                        : ((g = b), 0 === p && m(ub)),
                                    g !== b
                                        ? ((k = E()),
                                        k === b && (k = null),
                                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)),
                                h === b &&
                                ((h = e),
                                    118 === d.charCodeAt(e)
                                        ? ((g = vb), e++)
                                        : ((g = b), 0 === p && m(wb)),
                                    g !== b
                                        ? ((k = E()),
                                        k === b && (k = null),
                                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)),
                                h === b && ((h = E()), h === b && (h = null)))));
                            }
                            h !== b ? (c = f = [f, h]) : ((e = c), (c = b));
                        } else (e = c), (c = b);
                        c !== b
                            ? ((f = e),
                                p++,
                                Na.test(d.charAt(e))
                                    ? ((h = d.charAt(e)), e++)
                                    : ((h = b), 0 === p && m(Oa)),
                                p--,
                                h === b ? (f = void 0) : ((e = f), (f = b)),
                                f !== b
                                    ? ((h = w()),
                                        h !== b
                                            ? ((q = a), (a = c = {type: "v_explicit"}))
                                            : ((e = a), (a = b)))
                                    : ((e = a), (a = b)))
                            : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function H() {
                    var a = e;
                    var c = w();
                    if (c !== b) {
                        var f = [];
                        if (58 === d.charCodeAt(e)) {
                            var h = Bb;
                            e++;
                        } else (h = b), 0 === p && m(Cb);
                        if (h !== b)
                            for (; h !== b;)
                                f.push(h),
                                    58 === d.charCodeAt(e)
                                        ? ((h = Bb), e++)
                                        : ((h = b), 0 === p && m(Cb));
                        else f = b;
                        if (f === b)
                            if (
                                ((f = e),
                                    46 === d.charCodeAt(e)
                                        ? ((h = F), e++)
                                        : ((h = b), 0 === p && m(G)),
                                h !== b)
                            ) {
                                var g = e;
                                p++;
                                var k = e;
                                var l = w();
                                if (l !== b) {
                                    if (46 === d.charCodeAt(e)) {
                                        var n = F;
                                        e++;
                                    } else (n = b), 0 === p && m(G);
                                    if (n !== b) {
                                        var q = w();
                                        if (q !== b) {
                                            if (46 === d.charCodeAt(e)) {
                                                var t = F;
                                                e++;
                                            } else (t = b), 0 === p && m(G);
                                            t !== b ? (k = l = [l, n, q, t]) : ((e = k), (k = b));
                                        } else (e = k), (k = b);
                                    } else (e = k), (k = b);
                                } else (e = k), (k = b);
                                p--;
                                k === b ? (g = void 0) : ((e = g), (g = b));
                                g !== b ? (f = h = [h, g]) : ((e = f), (f = b));
                            } else (e = f), (f = b);
                        f !== b
                            ? ((h = w()), h !== b ? (a = c = [c, f, h]) : ((e = a), (a = b)))
                            : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function da() {
                    var a = e;
                    var c = w();
                    if (c !== b) {
                        if (Gc.test(d.charAt(e))) {
                            var f = d.charAt(e);
                            e++;
                        } else (f = b), 0 === p && m(Hc);
                        if (f !== b) {
                            var h = w();
                            h !== b ? (a = c = [c, f, h]) : ((e = a), (a = b));
                        } else (e = a), (a = b);
                    } else (e = a), (a = b);
                    a === b && (a = Y());
                    return a;
                }

                function C() {
                    var a = e;
                    var c = [];
                    if (Ra.test(d.charAt(e))) {
                        var f = d.charAt(e);
                        e++;
                    } else (f = b), 0 === p && m(Db);
                    if (f === b) {
                        f = e;
                        if (46 === d.charCodeAt(e)) {
                            var h = F;
                            e++;
                        } else (h = b), 0 === p && m(G);
                        if (h !== b) {
                            var g = e;
                            p++;
                            var k = e;
                            var l = w();
                            if (l !== b) {
                                if (46 === d.charCodeAt(e)) {
                                    var n = F;
                                    e++;
                                } else (n = b), 0 === p && m(G);
                                if (n !== b) {
                                    var t = w();
                                    if (t !== b) {
                                        if (46 === d.charCodeAt(e)) {
                                            var u = F;
                                            e++;
                                        } else (u = b), 0 === p && m(G);
                                        u !== b ? (k = l = [l, n, t, u]) : ((e = k), (k = b));
                                    } else (e = k), (k = b);
                                } else (e = k), (k = b);
                            } else (e = k), (k = b);
                            p--;
                            k === b ? (g = void 0) : ((e = g), (g = b));
                            g !== b ? (f = h = [h, g]) : ((e = f), (f = b));
                        } else (e = f), (f = b);
                        f === b &&
                        (d.substr(e, 3) === xa
                            ? ((f = xa), (e += 3))
                            : ((f = b), 0 === p && m(Eb)),
                        f === b &&
                        (d.substr(e, 7) === ya
                            ? ((f = ya), (e += 7))
                            : ((f = b), 0 === p && m(Fb)),
                        f === b &&
                        ((f = e),
                            d.substr(e, 2) === za
                                ? ((h = za), (e += 2))
                                : ((h = b), 0 === p && m(Gb)),
                            h !== b
                                ? ((g = E()),
                                g === b && (g = null),
                                    g !== b ? (f = h = [h, g]) : ((e = f), (f = b)))
                                : ((e = f), (f = b)),
                        f === b &&
                        ((f = e),
                            d.substr(e, 3) === P
                                ? ((h = P), (e += 3))
                                : ((h = b), 0 === p && m(Aa)),
                            h !== b
                                ? ((g = Y()),
                                    g !== b
                                        ? (d.substr(e, 4) === Q
                                            ? ((k = Q), (e += 4))
                                            : ((k = b), 0 === p && m(Ba)),
                                            k !== b ? (f = h = [h, g, k]) : ((e = f), (f = b)))
                                        : ((e = f), (f = b)))
                                : ((e = f), (f = b)),
                        f === b &&
                        (d.substr(e, 4) === Q
                            ? ((f = Q), (e += 4))
                            : ((f = b), 0 === p && m(Ba)),
                        f === b &&
                        (d.substr(e, 3) === P
                            ? ((f = P), (e += 3))
                            : ((f = b), 0 === p && m(Aa)),
                        f === b && (f = Y())))))));
                    }
                    if (f !== b)
                        for (; f !== b;)
                            c.push(f),
                                Ra.test(d.charAt(e))
                                    ? ((f = d.charAt(e)), e++)
                                    : ((f = b), 0 === p && m(Db)),
                            f === b &&
                            ((f = e),
                                46 === d.charCodeAt(e)
                                    ? ((h = F), e++)
                                    : ((h = b), 0 === p && m(G)),
                                h !== b
                                    ? ((g = e),
                                        p++,
                                        (k = e),
                                        (l = w()),
                                        l !== b
                                            ? (46 === d.charCodeAt(e)
                                                ? ((n = F), e++)
                                                : ((n = b), 0 === p && m(G)),
                                                n !== b
                                                    ? ((t = w()),
                                                        t !== b
                                                            ? (46 === d.charCodeAt(e)
                                                                ? ((u = F), e++)
                                                                : ((u = b), 0 === p && m(G)),
                                                                u !== b
                                                                    ? (k = l = [l, n, t, u])
                                                                    : ((e = k), (k = b)))
                                                            : ((e = k), (k = b)))
                                                    : ((e = k), (k = b)))
                                            : ((e = k), (k = b)),
                                        p--,
                                        k === b ? (g = void 0) : ((e = g), (g = b)),
                                        g !== b ? (f = h = [h, g]) : ((e = f), (f = b)))
                                    : ((e = f), (f = b)),
                            f === b &&
                            (d.substr(e, 3) === xa
                                ? ((f = xa), (e += 3))
                                : ((f = b), 0 === p && m(Eb)),
                            f === b &&
                            (d.substr(e, 7) === ya
                                ? ((f = ya), (e += 7))
                                : ((f = b), 0 === p && m(Fb)),
                            f === b &&
                            ((f = e),
                                d.substr(e, 2) === za
                                    ? ((h = za), (e += 2))
                                    : ((h = b), 0 === p && m(Gb)),
                                h !== b
                                    ? ((g = E()),
                                    g === b && (g = null),
                                        g !== b ? (f = h = [h, g]) : ((e = f), (f = b)))
                                    : ((e = f), (f = b)),
                            f === b &&
                            ((f = e),
                                d.substr(e, 3) === P
                                    ? ((h = P), (e += 3))
                                    : ((h = b), 0 === p && m(Aa)),
                                h !== b
                                    ? ((g = Y()),
                                        g !== b
                                            ? (d.substr(e, 4) === Q
                                                ? ((k = Q), (e += 4))
                                                : ((k = b), 0 === p && m(Ba)),
                                                k !== b
                                                    ? (f = h = [h, g, k])
                                                    : ((e = f), (f = b)))
                                            : ((e = f), (f = b)))
                                    : ((e = f), (f = b)),
                            f === b &&
                            (d.substr(e, 4) === Q
                                ? ((f = Q), (e += 4))
                                : ((f = b), 0 === p && m(Ba)),
                            f === b &&
                            (d.substr(e, 3) === P
                                ? ((f = P), (e += 3))
                                : ((f = b), 0 === p && m(Aa)),
                            f === b && (f = Y()))))))));
                    else c = b;
                    c !== b && ((q = a), (c = ""));
                    return c;
                }

                function X() {
                    var a = e;
                    var c = w();
                    if (c !== b) {
                        var f = [];
                        var h = e;
                        if (Hb.test(d.charAt(e))) {
                            var g = d.charAt(e);
                            e++;
                        } else (g = b), 0 === p && m(Ib);
                        if (g !== b) {
                            var k = w();
                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b));
                        } else (e = h), (h = b);
                        h === b &&
                        ((h = e),
                            d.substr(e, 7) === Ca
                                ? ((g = Ca), (e += 7))
                                : ((g = b), 0 === p && m(Jb)),
                            g !== b
                                ? ((k = w()), k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                : ((e = h), (h = b)),
                        h === b &&
                        ((h = e),
                            d.substr(e, 4) === Da
                                ? ((g = Da), (e += 4))
                                : ((g = b), 0 === p && m(Kb)),
                            g !== b
                                ? ((k = w()), k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                : ((e = h), (h = b)),
                        h === b &&
                        ((h = e),
                            d.substr(e, 2) === Ea
                                ? ((g = Ea), (e += 2))
                                : ((g = b), 0 === p && m(Lb)),
                            g !== b
                                ? ((k = w()),
                                    k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                : ((e = h), (h = b)))));
                        if (h !== b)
                            for (; h !== b;)
                                f.push(h),
                                    (h = e),
                                    Hb.test(d.charAt(e))
                                        ? ((g = d.charAt(e)), e++)
                                        : ((g = b), 0 === p && m(Ib)),
                                    g !== b
                                        ? ((k = w()),
                                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)),
                                h === b &&
                                ((h = e),
                                    d.substr(e, 7) === Ca
                                        ? ((g = Ca), (e += 7))
                                        : ((g = b), 0 === p && m(Jb)),
                                    g !== b
                                        ? ((k = w()),
                                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)),
                                h === b &&
                                ((h = e),
                                    d.substr(e, 4) === Da
                                        ? ((g = Da), (e += 4))
                                        : ((g = b), 0 === p && m(Kb)),
                                    g !== b
                                        ? ((k = w()),
                                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)),
                                h === b &&
                                ((h = e),
                                    d.substr(e, 2) === Ea
                                        ? ((g = Ea), (e += 2))
                                        : ((g = b), 0 === p && m(Lb)),
                                    g !== b
                                        ? ((k = w()),
                                            k !== b ? (h = g = [g, k]) : ((e = h), (h = b)))
                                        : ((e = h), (h = b)))));
                        else f = b;
                        f !== b ? (a = c = [c, f]) : ((e = a), (a = b));
                    } else (e = a), (a = b);
                    return a;
                }

                function Ja() {
                    var a = e;
                    var c = H();
                    c === b && (c = C());
                    c === b && (c = null);
                    c !== b
                        ? (d.substr(e, 5) === Mb
                            ? ((c = Mb), (e += 5))
                            : ((c = b), 0 === p && m(Ic)),
                            c !== b
                                ? ((q = a),
                                    (a = c = {type: "title", value: [c], indices: [q, e - 1]}))
                                : ((e = a), (a = b)))
                        : ((e = a), (a = b));
                    return a;
                }

                function Ma() {
                    var a = e;
                    var c = w();
                    if (c !== b) {
                        if (d.substr(e, 4) === Nb) {
                            var f = Nb;
                            e += 4;
                        } else (f = b), 0 === p && m(Jc);
                        f === b &&
                        (d.substr(e, 2) === Fa
                            ? ((f = Fa), (e += 2))
                            : ((f = b), 0 === p && m(Ob)),
                        f === b &&
                        (d.substr(e, 2) === Pb
                            ? ((f = Pb), (e += 2))
                            : ((f = b), 0 === p && m(Kc))));
                        if (f !== b) {
                            var h = w();
                            if (h !== b) {
                                var g = e;
                                if (d.substr(e, 3) === Qb) {
                                    var k = Qb;
                                    e += 3;
                                } else (k = b), 0 === p && m(Lc);
                                if (k !== b) {
                                    var l = w();
                                    if (l !== b) {
                                        if (d.substr(e, 4) === Rb) {
                                            var n = Rb;
                                            e += 4;
                                        } else (n = b), 0 === p && m(Mc);
                                        if (n !== b) {
                                            var q = w();
                                            if (q !== b) {
                                                if (d.substr(e, 2) === Fa) {
                                                    var t = Fa;
                                                    e += 2;
                                                } else (t = b), 0 === p && m(Ob);
                                                if (t !== b) {
                                                    var u = w();
                                                    u !== b
                                                        ? (g = k = [k, l, n, q, t, u])
                                                        : ((e = g), (g = b));
                                                } else (e = g), (g = b);
                                            } else (e = g), (g = b);
                                        } else (e = g), (g = b);
                                    } else (e = g), (g = b);
                                } else (e = g), (g = b);
                                g === b && (g = null);
                                g !== b ? (a = c = [c, f, h, g]) : ((e = a), (a = b));
                            } else (e = a), (a = b);
                        } else (e = a), (a = b);
                    } else (e = a), (a = b);
                    return a;
                }

                function E() {
                    var a = e;
                    var c = w();
                    if (c !== b) {
                        if (46 === d.charCodeAt(e)) {
                            var f = F;
                            e++;
                        } else (f = b), 0 === p && m(G);
                        if (f !== b) {
                            var h = e;
                            p++;
                            var g = e;
                            var k = w();
                            if (k !== b) {
                                if (46 === d.charCodeAt(e)) {
                                    var l = F;
                                    e++;
                                } else (l = b), 0 === p && m(G);
                                if (l !== b) {
                                    var n = w();
                                    if (n !== b) {
                                        if (46 === d.charCodeAt(e)) {
                                            var q = F;
                                            e++;
                                        } else (q = b), 0 === p && m(G);
                                        q !== b ? (g = k = [k, l, n, q]) : ((e = g), (g = b));
                                    } else (e = g), (g = b);
                                } else (e = g), (g = b);
                            } else (e = g), (g = b);
                            p--;
                            g === b ? (h = void 0) : ((e = h), (h = b));
                            h !== b ? (a = c = [c, f, h]) : ((e = a), (a = b));
                        } else (e = a), (a = b);
                    } else (e = a), (a = b);
                    return a;
                }

                function oa() {
                    var a = e;
                    var c = w();
                    if (c !== b) {
                        if (44 === d.charCodeAt(e)) {
                            var f = sa;
                            e++;
                        } else (f = b), 0 === p && m(ta);
                        if (f !== b) {
                            var g = w();
                            g !== b ? (a = c = [c, f, g]) : ((e = a), (a = b));
                        } else (e = a), (a = b);
                    } else (e = a), (a = b);
                    return a;
                }

                function Ta() {
                    var a = e;
                    var c = w();
                    if (c !== b)
                        if (
                            (Sb.test(d.charAt(e))
                                ? ((c = d.charAt(e)), e++)
                                : ((c = b), 0 === p && m(Tb)),
                            c !== b)
                        )
                            if (((c = w()), c !== b)) {
                                c = e;
                                var f = ea();
                                if (f !== b) {
                                    var g = [];
                                    var k = e;
                                    var l = C();
                                    if (l !== b) {
                                        var n = ea();
                                        n !== b ? (k = l = [l, n]) : ((e = k), (k = b));
                                    } else (e = k), (k = b);
                                    for (; k !== b;)
                                        g.push(k),
                                            (k = e),
                                            (l = C()),
                                            l !== b
                                                ? ((n = ea()),
                                                    n !== b ? (k = l = [l, n]) : ((e = k), (k = b)))
                                                : ((e = k), (k = b));
                                    g !== b ? (c = f = [f, g]) : ((e = c), (c = b));
                                } else (e = c), (c = b);
                                c !== b
                                    ? ((f = w()),
                                        f !== b
                                            ? (Nc.test(d.charAt(e))
                                                ? ((g = d.charAt(e)), e++)
                                                : ((g = b), 0 === p && m(Oc)),
                                                g !== b
                                                    ? ((q = a), (a = c = Ub(c)))
                                                    : ((e = a), (a = b)))
                                            : ((e = a), (a = b)))
                                    : ((e = a), (a = b));
                            } else (e = a), (a = b);
                        else (e = a), (a = b);
                    else (e = a), (a = b);
                    return a;
                }

                function Ua() {
                    var a = e;
                    var c = w();
                    if (c !== b) {
                        var f = e;
                        44 === d.charCodeAt(e)
                            ? ((c = sa), e++)
                            : ((c = b), 0 === p && m(ta));
                        if (c !== b) {
                            var g = w();
                            g !== b ? (f = c = [c, g]) : ((e = f), (f = b));
                        } else (e = f), (f = b);
                        f === b && (f = null);
                        if (f !== b) {
                            c = e;
                            g = ea();
                            if (g !== b) {
                                f = [];
                                var k = e;
                                var l = C();
                                if (l !== b) {
                                    var n = ea();
                                    n !== b ? (k = l = [l, n]) : ((e = k), (k = b));
                                } else (e = k), (k = b);
                                for (; k !== b;)
                                    f.push(k),
                                        (k = e),
                                        (l = C()),
                                        l !== b
                                            ? ((n = ea()),
                                                n !== b ? (k = l = [l, n]) : ((e = k), (k = b)))
                                            : ((e = k), (k = b));
                                f !== b ? (c = g = [g, f]) : ((e = c), (c = b));
                            } else (e = c), (c = b);
                            c !== b ? ((q = a), (a = c = Ub(c))) : ((e = a), (a = b));
                        } else (e = a), (a = b);
                    } else (e = a), (a = b);
                    return a;
                }

                function ea() {
                    var a = e;
                    if (30 === d.charCodeAt(e)) {
                        var c = Vb;
                        e++;
                    } else (c = b), 0 === p && m(Wb);
                    if (c !== b)
                        if (((c = la()), c !== b)) {
                            if (30 === d.charCodeAt(e)) {
                                var f = Vb;
                                e++;
                            } else (f = b), 0 === p && m(Wb);
                            f !== b
                                ? ((q = a),
                                    (a = c =
                                        {
                                            type: "translation",
                                            value: c.value,
                                            indices: [q, e - 1],
                                        }))
                                : ((e = a), (a = b));
                        } else (e = a), (a = b);
                    else (e = a), (a = b);
                    return a;
                }

                function L() {
                    var a;
                    return (a = /^[0-9]{1,3}(?!\d|,000)/.exec(d.substr(e)))
                        ? ((q = e),
                            (e += a[0].length),
                            {
                                type: "integer",
                                value: parseInt(a[0], 10),
                                indices: [q, e - 1],
                            })
                        : b;
                }

                function la() {
                    var a = e;
                    var c = [];
                    if (Pa.test(d.charAt(e))) {
                        var f = d.charAt(e);
                        e++;
                    } else (f = b), 0 === p && m(Qa);
                    if (f !== b)
                        for (; f !== b;)
                            c.push(f),
                                Pa.test(d.charAt(e))
                                    ? ((f = d.charAt(e)), e++)
                                    : ((f = b), 0 === p && m(Qa));
                    else c = b;
                    c !== b &&
                    ((q = a),
                        (c = {
                            type: "integer",
                            value: parseInt(c.join(""), 10),
                            indices: [q, e - 1],
                        }));
                    return c;
                }

                function Va() {
                    var a = e;
                    var c = [];
                    if (Xb.test(d.charAt(e))) {
                        var f = d.charAt(e);
                        e++;
                    } else (f = b), 0 === p && m(Yb);
                    if (f !== b)
                        for (; f !== b;)
                            c.push(f),
                                Xb.test(d.charAt(e))
                                    ? ((f = d.charAt(e)), e++)
                                    : ((f = b), 0 === p && m(Yb));
                    else c = b;
                    c !== b &&
                    ((q = a),
                        (c = {type: "word", value: c.join(""), indices: [q, e - 1]}));
                    return c;
                }

                function Wa() {
                    var a = e;
                    if (Sb.test(d.charAt(e))) {
                        var c = d.charAt(e);
                        e++;
                    } else (c = b), 0 === p && m(Tb);
                    c !== b &&
                    ((q = a), (c = {type: "stop", value: c, indices: [q, e - 1]}));
                    return c;
                }

                function w() {
                    var a = Y();
                    a === b && (a = null);
                    return a;
                }

                function Y() {
                    var a;
                    return (a = /^[\s\xa0*]+/.exec(d.substr(e)))
                        ? ((e += a[0].length), [])
                        : b;
                }

                c = void 0 !== c ? c : {};
                var b = {},
                    Zb = {start: n},
                    $b = n,
                    Ga = "(",
                    ac = f("(", !1),
                    bc = ")",
                    cc = f(")", !1),
                    ja = "\u001f",
                    ka = f("\u001f", !1),
                    dc = "/",
                    ec = f("/", !1),
                    fc = /^[1-8]/,
                    gc = g([["1", "8"]], !1, !1),
                    Xa = function (a) {
                        return {type: "b", value: a.value, indices: [q, e - 1]};
                    },
                    Ya = function (a, b) {
                        return {type: "bc", value: [a, b], indices: [q, e - 1]};
                    },
                    sa = ",",
                    ta = f(",", !1),
                    F = ".",
                    G = f(".", !1),
                    ma = function (a, b) {
                        return {type: "bcv", value: [a, b], indices: [q, e - 1]};
                    },
                    Ka = "-",
                    La = f("-", !1),
                    Za = function (a, b) {
                        return {type: "bc", value: [b, a], indices: [q, e - 1]};
                    },
                    $a = "th",
                    hc = f("th", !1),
                    ab = "nd",
                    ic = f("nd", !1),
                    bb = "st",
                    jc = f("st", !1),
                    cb = "/1\u001f",
                    kc = f("/1\u001f", !1),
                    db = function (a, b) {
                        return {type: "cv", value: [a, b], indices: [q, e - 1]};
                    },
                    ua = "ff",
                    eb = f("ff", !1),
                    va = /^[a-z0-9]/,
                    wa = g(
                        [
                            ["a", "z"],
                            ["0", "9"],
                        ],
                        !1,
                        !1
                    ),
                    fb = "f",
                    gb = f("f", !1),
                    Na = /^[a-z]/,
                    Oa = g([["a", "z"]], !1, !1),
                    hb = "/9\u001f",
                    lc = f("/9\u001f", !1),
                    ib = "/2\u001f",
                    mc = f("/2\u001f", !1),
                    jb = ".1",
                    nc = f(".1", !1),
                    Pa = /^[0-9]/,
                    Qa = g([["0", "9"]], !1, !1),
                    oc = /^[a-e]/,
                    pc = g([["a", "e"]], !1, !1),
                    kb = function (a) {
                        return {type: "v", value: [a], indices: [q, e - 1]};
                    },
                    lb = "ch",
                    qc = f("ch", !1),
                    mb = "apters",
                    rc = f("apters", !1),
                    nb = "apter",
                    sc = f("apter", !1),
                    ob = "apts",
                    tc = f("apts", !1),
                    pb = "pts",
                    uc = f("pts", !1),
                    qb = "apt",
                    vc = f("apt", !1),
                    rb = "aps",
                    wc = f("aps", !1),
                    sb = "ap",
                    xc = f("ap", !1),
                    yc = "p",
                    zc = f("p", !1),
                    tb = "s",
                    ub = f("s", !1),
                    Ac = "a",
                    Bc = f("a", !1),
                    vb = "v",
                    wb = f("v", !1),
                    xb = "erses",
                    Cc = f("erses", !1),
                    yb = "erse",
                    Dc = f("erse", !1),
                    zb = "er",
                    Ec = f("er", !1),
                    Ab = "ss",
                    Fc = f("ss", !1),
                    Bb = ":",
                    Cb = f(":", !1),
                    Gc = /^["']/,
                    Hc = g(['"', "'"], !1, !1),
                    Ra = /^[,;\/:&\-\u2013\u2014~]/,
                    Db = g(",;/:&-\u2013\u2014~".split(""), !1, !1),
                    xa = "and",
                    Eb = f("and", !1),
                    ya = "compare",
                    Fb = f("compare", !1),
                    za = "cf",
                    Gb = f("cf", !1),
                    P = "see",
                    Aa = f("see", !1),
                    Q = "also",
                    Ba = f("also", !1),
                    Hb = /^[\-\u2013\u2014]/,
                    Ib = g(["-", "\u2013", "\u2014"], !1, !1),
                    Ca = "through",
                    Jb = f("through", !1),
                    Da = "thru",
                    Kb = f("thru", !1),
                    Ea = "to",
                    Lb = f("to", !1),
                    Mb = "title",
                    Ic = f("title", !1),
                    Nb = "from",
                    Jc = f("from", !1),
                    Fa = "of",
                    Ob = f("of", !1),
                    Pb = "in",
                    Kc = f("in", !1),
                    Qb = "the",
                    Lc = f("the", !1),
                    Rb = "book",
                    Mc = f("book", !1),
                    Sb = /^[([]/,
                    Tb = g(["(", "["], !1, !1),
                    Nc = /^[)\]]/,
                    Oc = g([")", "]"], !1, !1),
                    Ub = function (a) {
                        return {
                            type: "translation_sequence",
                            value: a,
                            indices: [q, e - 1],
                        };
                    },
                    Vb = "\u001e",
                    Wb = f("\u001e", !1);
                f(",000", !1);
                var Xb = /^[^\x1F\x1E([]/,
                    Yb = g(["\u001f", "\u001e", "(", "["], !0, !1);
                g(" \t\r\n\u00a0*".split(""), !1, !1);
                var e = 0,
                    q = 0,
                    pa = [{line: 1, column: 1}],
                    M = 0,
                    Ha = [],
                    p = 0;
                if ("startRule" in c) {
                    if (!(c.startRule in Zb))
                        throw Error(
                            "Can't start parsing from rule \"" + c.startRule + '".'
                        );
                    $b = Zb[c.startRule];
                }
                "punctuation_strategy" in c &&
                "eu" === c.punctuation_strategy &&
                ((H = oa), (Ra = /^[;\/:&\-\u2013\u2014~]/));
                var Sa = $b();
                if (Sa !== b && e === d.length) return Sa;
                Sa !== b && e < d.length && m({type: "end"});
                throw (function (b, c, d) {
                    return new a(a.buildMessage(b, c), b, c, d);
                })(
                    Ha,
                    M < d.length ? d.charAt(M) : null,
                    M < d.length ? k(M, M + 1) : k(M, M)
                );
            },
        };
    })(this);
}.call(this));
