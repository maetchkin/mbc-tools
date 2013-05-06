mbc-tools
=

sax -> ns -> js 0.0.1
-

SAX утилита для разбора и обработки входного XML документа с помощью набора соответствующих неймспейсу правил. Набор правил содержится в определенном месте ( `./ns/*.js` по умолчанию) Поддерживается минимальный формат задания правил:

    "*","tag" – SAX событие начала разбора узла.
    "/*", "/tag" – SAX событие окончания разбора узла.
    "~*", "~tag" – Логика обработки в случае необходимости.


SAX based utility for parsing and transformation XML documents provides clear separation by namespaced rules. Ruleset is mini-syntaxed js files placed in assigned location ( `./ns/*.js` by default):

    "*","tag" – SAX open event. Parse state.
    "/*", "/tag" – SAX close event. Parse state.
    "~*", "~tag" – Some logic if need. Reduce state.

Usage:

    node sax-ns.js -s example.xml

Options:

    -s, --source FILE      XML Source
    -o, --output FILE      Write result to FILE
    -e, --encoding [STRING]Source's encoding (Default is utf8)
    -n, --ns-match [STRING]Minimatch for namespaces implementation (Default is ns/*.js)
    -v, --version          Display the current version
    -h, --help             Display help and usage details



