/*
ShEx grammar rules based on the Last Call Working Draft of 03/03/2017:
  https://github.com/shexSpec/grammar/blob/shex2.1/bnf

Be careful with grammar notation - it is EBNF in prolog syntax!
[...] lists always represent sequence.
or can be used as binary operator or n-ary prefix term - do not put [...] 
inside unless you want sequence as a single disjunct.
*, +, ? - generally used as 1-ary terms 
stephen.cresswell@tso.co.uk
*/

% We need to be careful with end-of-input marker $
% Since we never actually receive this from Codemirror, 
% we can't have it appear on RHS of deployed rules.
% However, we do need it to check whether rules *could* precede 
% end-of-input, so use it with top-level

:-dynamic '==>'/2.


%[1] OK
shexDoC  ==> [*(directive),?([or(notStartAction,startActions),*(statement)]), $ ].

%[2] OK
directive ==> [or(baseDecl,prefixDecl)].

%[3] OK
baseDecl ==> ['BASE','IRI_REF'].

%[4] OK
prefixDecl ==> ['PREFIX','PNAME_NS','IRI_REF'].

%[5] OK
notStartAction ==> [or(startt,shapeExprDecl)].

%[6] OK
startt ==> ['start','=',shapeExpression].

%[7] OK
startActions ==> [+(codeDecl)].

%[8] OK
statement ==> [or(directive,notStartAction)].

%[9] OK
shapeExprDecl ==> [shapeExprLabel,or(shapeExpression,'EXTERNAL')].

%[10] OK
shapeExpression ==> [shapeOr].

%[11] OK
inlineShapeExpression ==> [inlineShapeOr].

%[12] OK
shapeOr ==> [shapeAnd,*(['OR',shapeAnd])].

%[13] OK
inlineShapeOr ==> [inlineShapeAnd,*(['OR',inlineShapeAnd])].

%[14] OK
shapeAnd ==> [shapeNot,*(['AND',shapeNot])].

%[15] OK
inlineShapeAnd ==> [inlineShapeNot,*(['AND',inlineShapeNot])].

%[16] OK
shapeNot ==> [?('NOT'),shapeAtom].

%[17] OK
inlineShapeNot ==> [?('NOT'),inlineShapeAtom].

%[18] OK
shapeAtom ==> [nodeConstraint,?(shapeOrRef)].
shapeAtom ==> [shapeOrRef].
shapeAtom ==> ['(',shapeExpression,')'].
shapeAtom ==> ['.'].


%[19] OK
inlineShapeAtom ==> [nodeConstraint,?(inlineShapeOrRef)].
inlineShapeAtom ==> [inlineShapeOrRef,?(nodeConstraint)].
inlineShapeAtom ==> ['(',shapeExpression,')'].
inlineShapeAtom ==> ['.'].

%[20] OK
shapeOrRef ==> [shapeDefinition].
shapeOrRef ==> ['ATPNAME_NS'].
shapeOrRef ==> ['ATPNAME_LN'].
shapeOrRef ==> ['@',shapeExprLabel].

%[21] OK
inlineShapeOrRef ==> [inlineShapeDefinition].
inlineShapeOrRef ==> ['ATPNAME_NS'].
inlineShapeOrRef ==> ['ATPNAME_LN'].
inlineShapeOrRef ==> ['@',shapeExprLabel].


%[22] OK
nodeConstraint ==> ['LITERAL',*(stringFacet)].
nodeConstraint ==> [nonLiteralKind,*(xsFacet)].
nodeConstraint ==> [datatype,*(xsFacet)].
nodeConstraint ==> [valueSet,*(xsFacet)].
nodeConstraint ==> [+(xsFacet)].

%[23] OK
nonLiteralKind ==> ['IRI'].
nonLiteralKind ==> ['BNODE'].
nonLiteralKind ==> ['NONLITERAL'].

%[24] OK
xsFacet ==> [or(stringFacet,numericFacet)].

%[25] OK
stringFacet ==> [stringLength,'INTEGER'].
stringFacet ==> ['REGEXP'].

%[26] OK
stringLength ==> ['LENGTH'].
stringLength ==> ['MINLENGTH'].
stringLength ==> ['MAXLENGTH'].

%[27] OK
numericFacet ==> [numericRange,numericLiteral].
numericFacet ==> [numericLength,'INTEGER'].

%[31] 
numericRange ==> ['MININCLUSIVE'].
numericRange ==> ['MINEXCLUSIVE'].
numericRange ==> ['MAXINCLUSIVE'].
numericRange ==> ['MAXEXCLUSIVE'].

%[32] 
numericLength ==> ['TOTALDIGITS'].
numericLength ==> ['FRACTIONDIGITS'].

%[33] 
shapeDefinition ==>[*(or(extraPropertySet,'CLOSED')),'{',?(tripleExpression),'}',*(annotation),semanticActions].

%[34] 
inlineShapeDefinition ==> [*(or(extraPropertySet,'CLOSED')),'{',?(tripleExpression),'}'].

%[35] 
extraPropertySet ==> ['EXTRA',+(predicate)].

%[36] 
tripleExpression ==> [oneOfTripleExpr].

%[37] Modify to make it LL(1)
oneOfTripleExpr ==> [unaryTripleExpr, funaryTripleExpr]. 

funaryTripleExpr ==>[singleElementGroup, fsingle].

fsingle ==>[].
fsingle ==>['|',unaryTripleExpr,singleElementGroup,fmulti].


fmulti ==>['|',unaryTripleExpr,singleElementGroup,fmulti].
fmulti ==>[].


%[40][41][42] This 3 rules has been modyfied to make it LL(1)
singleElementGroup ==> [].
singleElementGroup ==> [';',elementGroup].

elementGroup ==>[].
elementGroup ==>[unaryTripleExpr,singleElementGroup].



%[43] 
unaryTripleExpr ==> [?(['$',tripleExprLabel]),or([or(tripleConstraint,bracketedTripleExpr)],include)].



%[44] 
bracketedTripleExpr ==> ['(',tripleExpression,')', ?(cardinality),*(annotation),semanticActions].

%[45]  
tripleConstraint ==> [?(senseFlags),predicate,
                    inlineShapeExpression,
                    ?(cardinality),*(annotation),
                    semanticActions].

%[46] 
cardinality ==> ['*'].
cardinality ==> ['+'].
cardinality ==> ['?'].
cardinality ==> ['REPEAT_RANGE'].

%[47] 
senseFlags ==> ['^'].

%[48] 
valueSet ==> ['[',*(valueSetValue),']'].

%[49] 
valueSetValue ==> [iriRange].
valueSetValue ==> [literalRange].
valueSetValue ==> [languageRange].
%valueSetValue ==> [+(exclusion)]. 


%[50] 
exclusion ==>['-',or(iri,literal,'LANTAG'),?('~')].


%[51] 
iriRange ==> [iri,?(['~',*(exclusion)])].

%[52] 
iriExclusion ==> ['-',iri,?('~')].

%[53] 
literalRange ==> [literal,?(['~',*(literalExclusion)])].


%[54] 
literalExclusion ==> ['-',literal,?('~')]. 


%[55] 
languageRange ==> ['LANGTAG',?(['~',*(languageExclusion)])].
languageRange ==> ['@','~',*(languageExclusion)].

%[56] 
languageExclusion ==> ['-','LANGTAG',?('~')].


%[57] 
include ==> ['&',tripleExprLabel].

%[58] 
annotation ==>['//',predicate,or(iri,literal)].

%[59] 
semanticActions ==> [*(codeDecl)].

%[60] 
codeDecl ==> ['%',iri,or('CODE','%')].

%[13t] 
literal ==> [or(rdfLiteral,numericLiteral,booleanLiteral)].

%[61] 
predicate ==> [or(iri,'a')].

%[62] 
datatype ==> [iri].

%[63] 
shapeExprLabel ==> [or(iri,blankNode)].

%[64] 
tripleExprLabel ==> [or(iri,blankNode)].

%[16t] 
numericLiteral ==>['INTEGER'].
numericLiteral ==>['DECIMAL'].
numericLiteral ==>['DOUBLE'].

%[65] 
rdfLiteral ==> [or(langString,[string,?(['^^',datatype])])].


%[134s] 
booleanLiteral ==> [or('true', 'false')].

%[135s] 
string ==> ['STRING_LITERAL1'].
string ==> ['STRING_LITERAL_LONG1'].
string ==> ['STRING_LITERAL2'].
string ==> ['STRING_LITERAL_LONG2'].

%[66] 
langString ==> ['LANG_STRING_LITERAL1'].
langString ==> ['LANG_STRING_LITERAL_LONG1'].
langString ==> ['LANG_STRING_LITERAL2'].
langString ==> ['LANG_STRING_LITERAL_LONG2'].

%[136s] 
iri ==> [or('IRI_REF',prefixedName)].

%[137s] 
prefixedName ==> [ or('PNAME_LN', 'PNAME_NS') ].

%[138] 
blankNode ==> ['BLANK_NODE_LABEL'].



% tens defined by regular expressions elsewhere
% RDF_TYPE ten now is harcoded in the rules
tm_regex([

'CODE',
'REPEAT_RANGE',
'IRI_REF',
'PNAME_NS',
'PNAME_LN',
'ATPNAME_NS',
'ATPNAME_LN',
'AT_IRI',
'REGEXP',
'BLANK_NODE_LABEL',
'LANGTAG',
'INTEGER',
'DECIMAL',
'DOUBLE',
'EXPONENT',
'STRING_LITERAL1',
'STRING_LITERAL2',
'STRING_LITERAL_LONG1',
'STRING_LITERAL_LONG2',
'LANG_STRING_LITERAL1',
'LANG_STRING_LITERAL2',
'LANG_STRING_LITERAL_LONG1',
'LANG_STRING_LITERAL_LONG2',
'UCHAR',
'ECHAR',
'PN_CHARS_BASE',
'PN_CHARS_U',
'PN_CHARS',
'PN_PREFIX',
'PN_LOCAL',
'PLX',
'PERCENT',
'HEX',
'PN_LOCAL_ESC',
'
',
'true',
'false'
]).

% Terminals where name of terminal is uppercased ten content
tm_keywords([

'BASE',
'PREFIX',
'IMPORT',
'EXTERNAL',
'OR',
'AND',
'NOT',
'LITERAL',
'NONLITERAL',
'IRI',
'BNODE',
'LENGTH',
'MINLENGTH',
'MAXLENGTH',
'MININCLUSIVE',
'MINEXCLUSIVE',
'MAXINCLUSIVE',
'MAXEXCLUSIVE',
'TOTALDIGITS',
'FRACTIONDIGITS',
'CLOSED',
'EXTRA'

]).

% Other tens representing fixed, case sensitive, strings
% Care! order longer tens first - e.g. IRI_REF, <=, <
% e.g. >=, >
% e.g. NIL, '('
% e.g. ANON, [
% e.g. DOUBLE, DECIMAL, INTEGER
% e.g. INTEGER_POSITIVE, PLUS
tm_punct([

'='= '=',
'('= '\\(',
')'= '\\)',
'.'= '\\.',
'@'= '@',
'{'= '\\{',
'}'= '\\}',
'|' = '\\|',
';'= ';',
'$'= '\\$',
'*'= '\\*',
'+'= '\\+',
'?' = '\\?',
'^'= '\\^',
'['= '\\[',
']'= '\\]',
'-'= '-',
'~'='\\~',
'&'='&',
'//'='\\/\\/',
'%'='%',
'^^'= '\\^\\^',
'a' = 'a',
'start' = 'start'
]).