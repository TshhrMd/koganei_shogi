// -------------------------------------------------------------------
// 将棋盤のJS
//   ・盤操作
//     マウス位置 
//       -> 
//          -> 筋段(例: ３四歩) ->Canvas座標
//   ・棋譜再生
//   ・H2B対戦
//   ・B2B対戦
//   ・評価値計算(外部)
//   ・読み筋表示(外部)
// -------------------------------------------------------------------

// 盤のサイズ
var NUMBER_OF_SUJI  = 9,  // 筋数
	NUMBER_OF_DANME = 9,  // 段数
	IMG_BLOCK_SIZE  = 50, // 駒画像の１つのます目のサイズ
	MASU_SIZE = null;     // １つのます目のサイズ。Canvasサイズから計算される。


var INFOAREA_SIZE = 0,  // 情報エリア縦サイズ
    KOMADAI_SIZE  = 0;  // 駒台縦サイズ

// 盤の色
var BAN_COLOUR          = '#FFFFFE',   // ほとんど白の灰色
	MASU_RINKAKU_COLOUR = '#777777',   // 灰色
	HIGHLIGHT_COLOUR    = '#fb0006',   // 赤
	LAST_MOVE_COLOUR    = '#f4fa25',   // 黄色
	KOMADAI_COLOUR      = '#e0ffff',   // cyan
	INFO_AREA_COLOUR    = '#FFFFFE';   // グレイ

var piecePositions = null;
var senteMochigomaSuiteCounter = 1,
    goteMochigomaSuiteCounter = 1;

// 駒コード
var FU      =  0, // 歩
	KYO     =  1, // 香
	KEI     =  2, // 桂
	GIN     =  3, // 銀
	KIN     =  4, // 金
	KAKU    =  5, // 角
	HISHA   =  6, // 飛
	GYOKU   =  7, // 玉
	TOKIN   =  8, // と
	NARIKYO =  9, // 成香
	NARIKEI = 10, // 成桂
	NARIGIN = 11, // 成銀
	UMA     = 13, // 馬
	RYU     = 14; // 竜

var IN_PLAY = 0,
	TAKEN = 1,
	MOCHIGOMA = 2,
	pieces = null,
	ctx = null,
	json = null,
	canvas = null,
	SENTE_TEAM = 0,
	GOTE_TEAM = 1,
	SELECT_LINE_WIDTH = 2,
	DEFAULT_LINE_WIDTH = 1,
	WAKU_LINE_WIDTH = 5,
	currentTurn = SENTE_TEAM;

// 選択された駒
var selectedPiece = null;

var promoteFlag = null;

var lastSuji  = null,
    lastDanme = null,
    lastPiece = null;

var senteMochigomaSuite,
    goteMochigomaSuite;

// #------------------------------------------------------------------
// # Block描画レイヤ
// #  左上(0,0)を起点とするFunction群
// #  Canvasのインタフェースとの親和性がよい
// #------------------------------------------------------------------

//
// class Block
// 
var Block = (function() {
    // コンストラクタ
    var Block = function(col, row) {
        if(!(this instanceof Block)) {
            return new Block(col, row);
        }

        this.row = row;
        this.col  = col;
    }

    var p = Block.prototype;
    p.setRow = function(row) {
        this.row = row;
    }
    p.setCol = function(col) {
        this.col = col;
    }
    p.setPosition = function(position) {
        this.position = position;
    }
    p.getRow = function() {
        return this.row;
    }
    p.getCol = function() {
        return this.col;
    }
    p.getPosition = function() {
        return this.position;
    }

	// -------------------------------------------------------------------
	// Blockにある自駒を取得する
	// block : 選択した移動先
	// -------------------------------------------------------------------
	p.getPiece = function() {
		var team = (currentTurn === GOTE_TEAM ? json.gote : json.sente);
		return this.getPieceForTeam(team);
	}

	// -------------------------------------------------------------------
	// Blockにある敵駒を取得する
	// block : 選択した移動先
	// -------------------------------------------------------------------
	p.getEnemyPiece = function() {
		//  自駒を取得する
		var team = (currentTurn === GOTE_TEAM ? json.sente : json.gote);
		return this.getPieceForTeam(team);	
	}

	// -------------------------------------------------------------------
	// Blockとteamが保有する駒たちから駒を取得する
	// teamOfPiece : teamが保有する駒
	// clickedBlock : クリックされた位置(Block)
	// return : piece
	// -------------------------------------------------------------------
	p.getPieceForTeam = function(teamOfPieces) {
		var piece = null,
			iPieceCounter = 0,
			pieceAtBlock = null;
		for (iPieceCounter = 0; iPieceCounter < teamOfPieces.length; iPieceCounter++) {
			piece = teamOfPieces[iPieceCounter];

			if (piece.status === IN_PLAY &&
					piece.col === this.col &&
					piece.row === this.row) {
				piece.position = iPieceCounter;
				pieceAtBlock = piece;
				iPieceCounter = teamOfPieces.length;
			}
		}
		return pieceAtBlock;
	}

	// -------------------------------------------------------------------
	// 指定したblockに駒がいないかを判定する
	// -------------------------------------------------------------------
	p.isEmpty = function() {
		var pieceAtBlock = this.getPieceForTeam(json.gote);

		if (pieceAtBlock === null) {
			pieceAtBlock = this.getPieceForTeam(json.sente);
		}

		return (pieceAtBlock !== null);
	}

	// -------------------------------------------------------------------
	// 選択している駒がクリックしたblockに進めるかを判定する
	// -------------------------------------------------------------------
	p.canSelectedMoveTo = function(myPiece, enemyPiece) {
		var bCanMove = false;
		switch (myPiece.piece) {
		case FU:
			bCanMove = this.canFuMoveTo(myPiece, enemyPiece);
			break;
		case KYO:
			bCanMove = this.canKyoMoveTo(myPiece, enemyPiece);
			break;
		case KEI:
			bCanMove = this.canKeiMoveTo(myPiece, enemyPiece);
			break;
		case GIN:
			bCanMove = this.canGinMoveTo(myPiece, enemyPiece);
			break;
		case KIN:
		case TOKIN:
		case NARIKYO:
		case NARIKEI:
		case NARIGIN:
			bCanMove = this.canKinMoveTo(myPiece, enemyPiece);
			break;
		case KAKU:
			bCanMove = this.canKakuMoveTo(myPiece, enemyPiece);
			break;
		case UMA:
			bCanMove = this.canUmaMoveTo(myPiece, enemyPiece);
			break;
		case HISHA:
			bCanMove = this.canHishaMoveTo(myPiece, enemyPiece);
			break;
		case RYU:
			bCanMove = this.canRyuMoveTo(myPiece, enemyPiece);
			break;
		case GYOKU:
			bCanMove = this.canGyokuMoveTo(myPiece, enemyPiece);
			break;
		}
		return bCanMove;
	}

	// -------------------------------------------------------------------
	// 歩は移動できるか
	// myPiece : 選択した駒
	// this : 選択した移動先
	// enemyPiece : 移動先にある敵駒
	// -------------------------------------------------------------------
	p.canFuMoveTo = function(myPiece, enemyPiece) {
		// 移動先のrow, column
		var rowToMoveToFlag = (this.row === (currentTurn === GOTE_TEAM ? myPiece.row + 1 : myPiece.row - 1));
		var colToMoveToFlag = (this.col === myPiece.col);

		// 敵駒がある
		var enemyExistFlag = enemyPiece !== null;

		// 駒がない
		var emptyBlockFlag = this.isEmpty() === false;

		// 移動先が一致　かつ　駒がない　あるいは　敵駒がある
		return (rowToMoveToFlag && colToMoveToFlag) &&
			(emptyBlockFlag === true || enemyExistFlag === true);
	}

	// -------------------------------------------------------------------
	// 香車は移動できるか
	// myPiece : 選択した駒
	// this : 選択した移動先
	// enemyPiece : 移動先にある敵駒
	// -------------------------------------------------------------------
	p.canKyoMoveTo = function(myPiece, enemyPiece) {
		// 移動先のrow,column
		var rowToMoveToFlag = (currentTurn === GOTE_TEAM ? this.row > myPiece.row : this.row < myPiece.row);
		var colToMoveToFlag = this.col === myPiece.col;

		// 敵駒がある
		var enemyExistFlag = enemyPiece !== null;

		// 駒がない
		var emptyBlockFlag = this.isEmpty() === false;

		// 間に駒がない
		var emptyBlockBetweenFlag = this.isEmptyBetween(myPiece);

		// 移動先が一致　かつ　駒がない　あるいは　敵駒がある  間に駒がない
		return (rowToMoveToFlag && colToMoveToFlag) &&
			(emptyBlockFlag === true || enemyExistFlag === true) && 
			(emptyBlockBetweenFlag === true);
	}

	// -------------------------------------------------------------------
	// 桂馬は移動できるか
	// myPiece : 選択した駒
	// this : 選択した移動先
	// enemyPiece : 移動先にある敵駒
	// -------------------------------------------------------------------
	p.canKeiMoveTo = function(myPiece, enemyPiece) {
		
		// 移動先のrow, col
		var rowToMoveToFlag = (currentTurn === GOTE_TEAM ? 
			(this.row == myPiece.row + 2) :
			(this.row == myPiece.row - 2));

		var colToMoveToFlag = (currentTurn === GOTE_TEAM ? 
			((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)) :
			((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)));

		// 敵駒がある
		var enemyExistFlag = enemyPiece !== null;

		// 駒がない
		var emptyBlockFlag = this.isEmpty() === false;

		// 間に駒がない
		var emptyBlockBetweenFlag = this.isEmptyBetween(myPiece);

		// 移動先が一致　かつ　駒がない　あるいは　敵駒がある  間に駒がない
		return (rowToMoveToFlag && colToMoveToFlag) &&
			(emptyBlockFlag === true || enemyExistFlag === true) && 
			(emptyBlockBetweenFlag === true);

	}

	// -------------------------------------------------------------------
	// 銀は移動できるか
	// myPiece : 選択した駒
	// this : 選択した移動先
	// enemyPiece : 移動先にある敵駒
	// -------------------------------------------------------------------
	p.canGinMoveTo = function(myPiece, enemyPiece) {
		
		// 移動先のrow, col
		var rowColMoveToFlag = (currentTurn === GOTE_TEAM ? 
			(
			((this.row == myPiece.row - 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1))) ||
			((this.row == myPiece.row + 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col)))
			) :
			(
			((this.row == myPiece.row + 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1))) ||
			((this.row == myPiece.row - 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col)))
			)
			);

		// 敵駒がある
		var enemyExistFlag = enemyPiece !== null;

		// 駒がない
		var emptyBlockFlag = this.isEmpty() === false;

		// 間に駒がない
		var emptyBlockBetweenFlag = this.isEmptyBetween(myPiece);

		// 移動先が一致　かつ　駒がない　あるいは　敵駒がある  間に駒がない
		return rowColMoveToFlag &&
			(emptyBlockFlag === true || enemyExistFlag === true) && 
			(emptyBlockBetweenFlag === true);

	}

	// -------------------------------------------------------------------
	// 金は移動できるか
	// myPiece : 選択した駒
	// this : 選択した移動先
	// enemyPiece : 移動先にある敵駒
	// -------------------------------------------------------------------
	p.canKinMoveTo = function(myPiece, enemyPiece) {
		
		// 移動先のrow, col
		var rowColMoveToFlag = (currentTurn === GOTE_TEAM ? 
			(
			((this.row == myPiece.row + 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col))) ||
			((this.row == myPiece.row)     && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1))) ||
			((this.row == myPiece.row - 1) &&  (this.col == myPiece.col))
			) :
			(
			((this.row == myPiece.row - 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col))) ||
			((this.row == myPiece.row)     && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1))) ||
			((this.row == myPiece.row + 1) &&  (this.col == myPiece.col))
			) 
			);

		// 敵駒がある
		var enemyExistFlag = enemyPiece !== null;

		// 駒がない
		var emptyBlockFlag = this.isEmpty() === false;

		// 間に駒がない
		var emptyBlockBetweenFlag = this.isEmptyBetween(myPiece);

		// 移動先が一致　かつ　駒がない　あるいは　敵駒がある  間に駒がない
		return rowColMoveToFlag &&
			(emptyBlockFlag === true || enemyExistFlag === true) && 
			(emptyBlockBetweenFlag === true);

	}

	// -------------------------------------------------------------------
	// 飛車は移動できるか
	// myPiece : 選択した駒
	// this : 選択した移動先
	// enemyPiece : 移動先にある敵駒
	// -------------------------------------------------------------------
	p.canHishaMoveTo = function(myPiece, enemyPiece) {		
		// 移動先のrow,column
		var rowColMoveToFlag = (currentTurn === GOTE_TEAM ? 
			(
			 ((this.row >  myPiece.row) &&  (this.col == myPiece.col)) ||
			 ((this.row == myPiece.row) && ((this.col >  myPiece.col)  || (this.col < myPiece.col))) ||
			 ((this.row <  myPiece.row) &&  (this.col == myPiece.col))
			) :
			(
			 ((this.row <  myPiece.row) &&  (this.col == myPiece.col)) ||
			 ((this.row == myPiece.row) && ((this.col >  myPiece.col)  || (this.col < myPiece.col))) ||
			 ((this.row >  myPiece.row) &&  (this.col == myPiece.col))
			) 
			);

		// 敵駒がある
		var enemyExistFlag = enemyPiece !== null;

		// 駒がない
		var emptyBlockFlag = this.isEmpty() === false;

		// 間に駒がない
		var emptyBlockBetweenFlag = this.isEmptyBetween(myPiece);

		// 移動先が一致　かつ　駒がない　あるいは　敵駒がある  間に駒がない
		return rowColMoveToFlag &&
			(emptyBlockFlag === true || enemyExistFlag === true) && 
			(emptyBlockBetweenFlag === true);
	}

	// -------------------------------------------------------------------
	// 竜は移動できるか
	// myPiece : 選択した駒
	// this : 選択した移動先
	// enemyPiece : 移動先にある敵駒
	// -------------------------------------------------------------------
	p.canRyuMoveTo = function(myPiece, enemyPiece) {		
		// 移動先のrow,column
		var rowColMoveToFlag = (currentTurn === GOTE_TEAM ? 
			(
			 ((this.row >  myPiece.row)     &&  (this.col == myPiece.col))    ||
			 ((this.row == myPiece.row)     && ((this.col >  myPiece.col)     || (this.col < myPiece.col)))      ||
			 ((this.row <  myPiece.row)     &&  (this.col == myPiece.col))    ||
			 ((this.row == myPiece.row + 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col))) ||
			 ((this.row == myPiece.row)     && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1))) ||
			 ((this.row == myPiece.row - 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col)))
			) :
			(
			 ((this.row <  myPiece.row)     &&  (this.col == myPiece.col))    ||
			 ((this.row == myPiece.row)     && ((this.col >  myPiece.col)     || (this.col < myPiece.col)))      ||
			 ((this.row >  myPiece.row)     &&  (this.col == myPiece.col))    ||
			 ((this.row == myPiece.row - 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col))) ||
			 ((this.row == myPiece.row)     && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1))) ||
			 ((this.row == myPiece.row + 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col))) 
			) 
			);

		// 敵駒がある
		var enemyExistFlag = enemyPiece !== null;

		// 駒がない
		var emptyBlockFlag = this.isEmpty() === false;

		// 間に駒がない
		var emptyBlockBetweenFlag = this.isEmptyBetween(myPiece);

		// 移動先が一致　かつ　駒がない　あるいは　敵駒がある  間に駒がない
		return rowColMoveToFlag &&
			(emptyBlockFlag === true || enemyExistFlag === true) && 
			(emptyBlockBetweenFlag === true);
	}

	// -------------------------------------------------------------------
	// 角は移動できるか
	// myPiece : 選択した駒
	// this : 選択した移動先
	// enemyPiece : 移動先にある敵駒
	// -------------------------------------------------------------------
	p.canKakuMoveTo = function(myPiece, enemyPiece) {		
		// 移動先のrow,column
		var rowColMoveToFlag = (currentTurn === GOTE_TEAM ? 
			(((this.row - myPiece.row) == (this.col - myPiece.col)) ||
			 ((myPiece.row - this.row) == (this.col - myPiece.col))) :
			(((this.row - myPiece.row) == (this.col - myPiece.col)) ||
			 ((myPiece.row - this.row) == (this.col - myPiece.col))));

		// 敵駒がある
		var enemyExistFlag = enemyPiece !== null;

		// 駒がない
		var emptyBlockFlag = this.isEmpty() === false;

		// 間に駒がない
		var emptyBlockBetweenFlag = this.isEmptyBetween(myPiece);

		// 移動先が一致　かつ　駒がない　あるいは　敵駒がある  間に駒がない
		return rowColMoveToFlag &&
			(emptyBlockFlag === true || enemyExistFlag === true) && 
			(emptyBlockBetweenFlag === true);
	}

	// -------------------------------------------------------------------
	// 馬は移動できるか
	// myPiece : 選択した駒
	// this : 選択した移動先
	// enemyPiece : 移動先にある敵駒
	// -------------------------------------------------------------------
	p.canUmaMoveTo = function(myPiece, enemyPiece) {
		// 移動先のrow,column
		var rowColMoveToFlag = (currentTurn === GOTE_TEAM ? 
			(
			((this.row - myPiece.row) == (this.col - myPiece.col)) ||
			((myPiece.row - this.row) == (this.col - myPiece.col)) ||
			((this.row == myPiece.row + 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col))) ||
			((this.row == myPiece.row)     && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1))) ||
			((this.row == myPiece.row - 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col)))
			) :
			(
			((this.row - myPiece.row) == (this.col - myPiece.col)) ||
			((myPiece.row - this.row) == (this.col - myPiece.col)) ||
			((this.row == myPiece.row - 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col))) ||
			((this.row == myPiece.row)     && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1))) ||
			((this.row == myPiece.row + 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col))) 
			)
			);

		// 敵駒がある
		var enemyExistFlag = enemyPiece !== null;

		// 駒がない
		var emptyBlockFlag = this.isEmpty() === false;

		// 間に駒がない
		var emptyBlockBetweenFlag = this.isEmptyBetween(myPiece);

		// 移動先が一致　かつ　駒がない　あるいは　敵駒がある  間に駒がない
		return rowColMoveToFlag &&
			(emptyBlockFlag === true || enemyExistFlag === true) && 
			(emptyBlockBetweenFlag === true);
	}

	// -------------------------------------------------------------------
	// 王は移動できるか
	// myPiece : 選択した駒
	// this : 選択した移動先
	// enemyPiece : 移動先にある敵駒
	// -------------------------------------------------------------------
	p.canGyokuMoveTo = function(myPiece, enemyPiece) {
		
		// 移動先のrow, col
		var rowColMoveToFlag = (currentTurn === GOTE_TEAM ? 
			(
			((this.row == myPiece.row + 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col))) ||
			((this.row == myPiece.row)     && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1))) ||
			((this.row == myPiece.row - 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col)))
			) :
			(
			((this.row == myPiece.row - 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col))) ||
			((this.row == myPiece.row)     && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1))) ||
			((this.row == myPiece.row + 1) && ((this.col == myPiece.col + 1) || (this.col == myPiece.col - 1)   || (this.col == myPiece.col)))) 
			);

		// 敵駒がある
		var enemyExistFlag = enemyPiece !== null;

		// 駒がない
		var emptyBlockFlag = this.isEmpty() === false;

		// 間に駒がない
		var emptyBlockBetweenFlag = this.isEmptyBetween(myPiece);

		// 移動先が一致　かつ　駒がない　あるいは　敵駒がある  間に駒がない
		return rowColMoveToFlag &&
			(emptyBlockFlag === true || enemyExistFlag === true) && 
			(emptyBlockBetweenFlag === true);

	}

	// -------------------------------------------------------------------
	// 移動先との間に駒があるかを判定
	// myPiece : 選択した駒
	// block : 選択した移動先
	// -------------------------------------------------------------------
	p.isEmptyBetween = function(piece){

		switch (piece.piece){
		case FU :
		case KEI:
		case GIN:
		case KIN:
		case TOKIN:
		case NARIKYO:
		case NARIKEI:
		case NARIGIN:
		case GYOKU:
			// 移動先との間の駒は関係なく移動可能
			break;
		case KYO :
			return this.isEmptyBlockBetweenForKyo(piece);
		case KAKU:
		case UMA:
			return this.isEmptyBlockBetweenForKaku(piece);
			break;
		case HISHA:
		case RYU:
			return this.isEmptyBlockBetweenForHisha(piece);
			break;
		}
		return true;
	}

	// -------------------------------------------------------------------
	// 香車の移動先との間に駒があるかを判定
	// piece : 移動元の駒
	// -------------------------------------------------------------------
	p.isEmptyBlockBetweenForKyo = function(piece){
		var goteTeam = json.gote;
		var senteTeam = json.sente;
		var counter ;

		var gotePiece = null,
			sentePiece = null,
			iPieceCounter = 0,
			pieceAtBlock = null;
		if (currentTurn === GOTE_TEAM){
			for (iPieceCounter = 0; iPieceCounter < goteTeam.length; iPieceCounter++) {
				// 後手の駒があるか
				gotePiece = goteTeam[iPieceCounter];
				if (gotePiece.col === piece.col){
					for (counter = piece.row + 1; counter < this.row; counter++){
						if (gotePiece.row === counter){
							return false;
						}
					}
				}
			}
			for (iPieceCounter = 0; iPieceCounter < senteTeam.length; iPieceCounter++) {
				// 先手の駒があるか
				sentePiece = senteTeam[iPieceCounter];
				if (sentePiece.col === piece.col){
					for (counter = piece.row + 1; counter < this.Row; counter++){
						if (sentePiece.row === counter){
							return false;
						}
					}
				}
			}
		}
		if (currentTurn === SENTE_TEAM){
			for (iPieceCounter = 0; iPieceCounter < goteTeam.length; iPieceCounter++) {
				// 後手の駒があるか
				gotePiece = goteTeam[iPieceCounter];
				if (gotePiece.col === piece.col){
					for (counter = piece.row - 1; counter > this.row; counter--){
						if (gotePiece.row === counter){
							return false;
						}
					}
				}
			}
			for (iPieceCounter = 0; iPieceCounter < senteTeam.length; iPieceCounter++) {
				// 先手の駒があるか
				sentePiece = senteTeam[iPieceCounter];
				if (sentePiece.col === piece.col){
					for (counter = piece.row - 1; counter > this.row; counter--){
						if (sentePiece.row === counter){
							return false;
						}
					}
				}
			}
		}
		return true;
	}

	// -------------------------------------------------------------------
	// 角、馬の移動先との間に駒があるかを判定
	// piece : 移動元の駒
	// -------------------------------------------------------------------
	p.isEmptyBlockBetweenForKaku = function(piece){
		var goteTeam = json.gote;
		var senteTeam = json.sente;
		var counter ;

		var gotePiece = null,
			sentePiece = null,
			iPieceCounter = 0,
			pieceAtBlock = null;

		for (iPieceCounter = 0; iPieceCounter < goteTeam.length; iPieceCounter++) {
			// 後手の駒があるか
			gotePiece = goteTeam[iPieceCounter];
			// 右下
			if ((this.row > piece.row) &&
			    (this.col > piece.col) &&
				(gotePiece.col > piece.col) && 
				(gotePiece.row > piece.row)){
				if ((gotePiece.row < this.row) && 
					(gotePiece.row - piece.row) == (gotePiece.col - piece.col)){
					return false;
				}
			}
			// 右上
			if ((this.row < piece.row) &&
			    (this.col > piece.col) &&
				(gotePiece.col > piece.col) && 
				(gotePiece.row < piece.row)){
				if ((gotePiece.row > this.row) && 
					(piece.row - gotePiece.row) == (gotePiece.col - piece.col)){
					return false;
				}
			}
			// 左下
			if ((this.row > piece.row) &&
			    (this.col < piece.col) &&
				(gotePiece.col < piece.col) && 
				(gotePiece.row > piece.row)){
				if ((gotePiece.row < this.row) && 
					(gotePiece.row - piece.row) == (piece.col - gotePiece.col)){
					return false;
				}
			}
			// 左上
			if ((this.row < piece.row) &&
			    (this.col < piece.col) &&
				(gotePiece.col < piece.col) && 
				(gotePiece.row < piece.row)){
				if ((gotePiece.row > this.row) && 
					(piece.row - gotePiece.row) == (piece.col - gotePiece.col)){
					return false;
				}
			}
		}
		for (iPieceCounter = 0; iPieceCounter < senteTeam.length; iPieceCounter++) {
			// 先手の駒があるか
			sentePiece = senteTeam[iPieceCounter];
			// 右下
			if ((this.row > piece.row) &&
			    (this.col > piece.col) &&
				(sentePiece.col > piece.col) && 
				(sentePiece.row > piece.row)){
				if ((sentePiece.row < this.row) && 
					(sentePiece.row - piece.row) == (sentePiece.col - piece.col)){
					return false;
				}
			}
			// 右上
			if ((this.row < piece.row) &&
			    (this.col > piece.col) &&
				(sentePiece.col > piece.col) && 
				(sentePiece.row < piece.row)){
				if ((sentePiece.row > this.row) && 
					(piece.row - sentePiece.row) == (sentePiece.col - piece.col)){
					return false;
				}
			}
			// 左下
			if ((this.row > piece.row) &&
			    (this.col < piece.col) &&
				(sentePiece.col < piece.col) && 
				(sentePiece.row > piece.row)){
				if ((sentePiece.row < this.row) && 
					(sentePiece.row - piece.row) == (piece.col - sentePiece.col)){
					return false;
				}
			}
			// 左上
			if ((this.row < piece.row) &&
			    (this.col < piece.col) &&
				(sentePiece.col < piece.col) && 
				(sentePiece.row < piece.row)){
				if ((sentePiece.row > this.row) && 
					(piece.row - sentePiece.row) == (piece.col - sentePiece.col)){
					return false;
				}
			}
		}
		return true;
	}

	// -------------------------------------------------------------------
	// 飛車、竜の移動先との間に駒があるかを判定
	// piece : 移動元の駒
	// -------------------------------------------------------------------
	p.isEmptyBlockBetweenForHisha = function(piece){
		var goteTeam = json.gote;
		var senteTeam = json.sente;
		var counter ;

		var gotePiece = null,
			sentePiece = null,
			iPieceCounter = 0,
			pieceAtBlock = null;
		if (currentTurn === GOTE_TEAM){
			for (iPieceCounter = 0; iPieceCounter < goteTeam.length; iPieceCounter++) {
				// 後手の駒があるか
				gotePiece = goteTeam[iPieceCounter];
				if (gotePiece.col === piece.col){
					for (counter = piece.row + 1; counter < this.row; counter++){
						if (gotePiece.row === counter){
							return false;
						}
					}
					for (counter = piece.row - 1; counter > this.row; counter--){
						if (gotePiece.row === counter){
							return false;
						}
					}
				}
				if (gotePiece.row === piece.row){
					for (counter = piece.col + 1; counter < this.col; counter++){
						if (gotePiece.col === counter){
							return false;
						}
					}
					for (counter = piece.col - 1; counter > this.col; counter--){
						if (gotePiece.col === counter){
							return false;
						}
					}
				}
			}
			for (iPieceCounter = 0; iPieceCounter < senteTeam.length; iPieceCounter++) {
				// 先手の駒があるか
				sentePiece = senteTeam[iPieceCounter];
				if (sentePiece.col === piece.col){
					for (counter = piece.row + 1; counter < this.row; counter++){
						if (sentePiece.row === counter){
							return false;
						}
					}
					for (counter = piece.row - 1; counter > this.row; counter--){
						if (sentePiece.row === counter){
							return false;
						}
					}
				}
				if (sentePiece.row === piece.row){
					for (counter = piece.col + 1; counter < this.col; counter++){
						if (sentePiece.col === counter){
							return false;
						}
					}
					for (counter = piece.col - 1; counter > this.col; counter--){
						if (sentePiece.col=== counter){
							return false;
						}
					}
				}
			}
		}
		if (currentTurn === SENTE_TEAM){
			for (iPieceCounter = 0; iPieceCounter < goteTeam.length; iPieceCounter++) {
				// 後手の駒があるか
				gotePiece = goteTeam[iPieceCounter];
				if (gotePiece.col === piece.col){
					for (counter = piece.row - 1; counter > this.row; counter--){
						if (gotePiece.row === counter){
							return false;
						}
					}
					for (counter = piece.row + 1; counter < this.row; counter++){
						if (gotePiece.row === counter){
							return false;
						}
					}
				}
				if (gotePiece.row === piece.row){
					for (counter = piece.col - 1; counter > this.col; counter--){
						if (gotePiece.col === counter){
							return false;
						}
					}
					for (counter = piece.col + 1; counter < this.col; counter++){
						if (gotePiece.col === counter){
							return false;
						}
					}
				}
			}
			for (iPieceCounter = 0; iPieceCounter < senteTeam.length; iPieceCounter++) {
				// 先手の駒があるか
				sentePiece = senteTeam[iPieceCounter];
				if (sentePiece.col === piece.col){
					for (counter = piece.row - 1; counter > this.row; counter--){
						if (sentePiece.row === counter){
							return false;
						}
					}
					for (counter = piece.row + 1; counter < this.row; counter++){
						if (sentePiece.row === counter){
							return false;
						}
					}
				}
				if (sentePiece.row === piece.row){
					for (counter = piece.col - 1; counter > this.col; counter--){
						if (sentePiece.col === counter){
							return false;
						}
					}
					for (counter = piece.col + 1; counter < this.col; counter++){
						if (sentePiece.col === counter){
							return false;
						}
					}
				}
			}
		}
		return true;
	}
    return Block;
})();

// #------------------------------------------------------------------
// #マスレイヤ
// #  右上(1,1)を起点とするFunction群
// #  KIFインタフェースとの親和性がよい
// #------------------------------------------------------------------

//
// class Masu
// 
var Masu = (function() {
    // コンストラクタ
    var Masu = function(suji, danme) {
        if(!(this instanceof Masu)) {
            return new Masu(suji, danme);
        }

        this.suji = suji;
        this.danme  = danme;
    }

    var p = Masu.prototype;
    p.setSuji = function(suji) {
        this.suji = suji;
    }
    p.setNanme = function(danme) {
        this.danme = danme;
    }
    p.getSuji = function() {
        return this.suji;
    }
    p.getDanme = function() {
        return this.danme;
    }

	// -------------------------------------------------------------------
	// マスにある敵駒を取得する
	// -------------------------------------------------------------------
	p.getEnemyPiece = function() {
		var block = convertToBlock(this.suji, this.danme);
		return block.getEnemyPiece();
	}

	// -------------------------------------------------------------------
	// 指定したマスにある自駒を取得する。
	// return : 指定したマスにある自駒
	// -- global --
	//   currentTurn - 手番
	//   json : Team毎の駒の位置情報
	// -------------------------------------------------------------------
	p.getPiece = function() {
		block = convertToBlock(this.suji, this.danme);
		var team = (currentTurn === GOTE_TEAM ? json.gote : json.sente);
		return block.getPieceForTeam(team);
	}

	// -------------------------------------------------------------------
	// マスを指定しマスにある駒を取得する。取得した駒選択状態にする。
	// piece :  選択されたBlock位置
	// -------------------------------------------------------------------
	p.checkIfPieceClicked = function() {
		var piece = this.getPiece();
		if (piece !== null) {
			selectPiece(piece);
		}
	}

	// -------------------------------------------------------------------
	// 選択している駒がクリックしたマスに進めるかを判定する
	// -------------------------------------------------------------------
	p.canSelectedMoveTo = function(myPiece, enemyPiece) {
		block = convertToBlock(this.suji, this.danme);
		return block.canSelectedMoveTo(myPiece, enemyPiece);
	}

	// -------------------------------------------------------------------
	// 盤を動かす判定処理
	// 自駒であれば再選択、敵駒であれば捕捉、駒がなければ移動する
	// masu  : 移動先のマス
	// -------------------------------------------------------------------
	p.processMove = function() {
		// 自駒
		var myPiece = this.getPiece(),

			// 敵駒
			enemyPiece = this.getEnemyPiece();

		if (myPiece !== null) {

			// 自駒をクリックした場合、元の選択した駒を外す
			removeSelection(selectedPiece);
		
			// 新たにクリックした駒を選択する
			this.checkIfPieceClicked();

		} else if (this.canSelectedMoveTo(selectedPiece, enemyPiece) === true) {

			// 自駒以外をクリックした場合、駒を移動する
			this.movePiece(enemyPiece);
		}

		// 大外の枠
		drawWaku();
	}

	// -------------------------------------------------------------------
	// 盤を動かす
	// masu  : 移動先のマス
	// -------------------------------------------------------------------
	p.movePiece = function(enemyPiece) {

		// 盤を再描画
		if (lastPiece != null){
			drawMasu2(lastSuji, lastDanme, BAN_COLOUR);
			drawKoma(lastPiece, (currentTurn != GOTE_TEAM));
		}

		// 選択中の駒のマスを取得しクリアする
		selectedMasu = convertToMasu(selectedPiece.col, selectedPiece.row);
		drawMasu(selectedMasu.suji, selectedMasu.danme);

		// 自駒の場所をクリックしたマスの場所に変更する
		var myTeam = (currentTurn === SENTE_TEAM ? json.sente : json.gote);
		var block = convertToBlock(this.suji, this.danme);

		beforeMoveCol = myTeam[selectedPiece.position].col;
		beforeMoveRow = myTeam[selectedPiece.position].row;

		myTeam[selectedPiece.position].col = block.col;
		myTeam[selectedPiece.position].row = block.row;

	console.log("=== beforeMove ==============");
	console.log("col      = "+beforeMoveCol);
	console.log("row      = "+beforeMoveRow);

		// 成不成を確認
		confirmPromote(myTeam, beforeMoveCol, beforeMoveRow);

		if (enemyPiece !== null) {
			// 敵の駒を取られた状態にする
			var enemyTeam = (currentTurn !== SENTE_TEAM ? json.sente : json.gote);
			enemyTeam[enemyPiece.position].status = TAKEN;

			// 味方の駒を持ち駒状態にする
			myTeam[enemyPiece.position].status = MOCHIGOMA
			myTeam[enemyPiece.position].piece = enemyTeam[enemyPiece.position].piece > 7 ? enemyTeam[enemyPiece.position].piece - 8 : enemyTeam[enemyPiece.position].piece;
			myTeam[enemyPiece.position].col = null;
			myTeam[enemyPiece.position].row = null;

			// 
			selectedMasu = convertToMasu(enemyPiece.col, enemyPiece.row);
			drawMasu(selectedMasu.suji, selectedMasu.danme);

			// 敵の駒を初期状態にする
			enemyTeam[enemyPiece.position].piece = enemyTeam[enemyPiece.position].piece > 7 ? enemyTeam[enemyPiece.position].piece - 8 : enemyTeam[enemyPiece.position].piece;
			enemyTeam[enemyPiece.position].col = null;
			enemyTeam[enemyPiece.position].row = null;

			// 持ち駒を更新する
			drawMochigoma(enemyPiece, (currentTurn === GOTE_TEAM));
		}

		drawMasu2(this.suji, this.danme, LAST_MOVE_COLOUR);

		// Draw the piece in the new position
		drawKoma(selectedPiece, (currentTurn === GOTE_TEAM));

		currentTurn = (currentTurn === SENTE_TEAM ? GOTE_TEAM : SENTE_TEAM);

		lastPiece = myTeam[selectedPiece.position];
		lastSuji  = this.suji;
		lastDanme = this.danme;

		selectedPiece = null;
	}

    return Masu;
})();

//
// class Mochigoma
// 
var Mochigoma = (function() {
    // コンストラクタ
    var Mochigoma = function(piece, count) {
        if(!(this instanceof Mochigoma)) {
            return new Mochigoma(piece, count);
        }

        this.piece = piece;
        this.count  = count;
    }

    var p = Mochigoma.prototype;
    p.setPiece = function(piece) {
        this.piece = piece;
    }
    p.setCount = function(count) {
        this.count = count;
    }
    p.getPiece = function() {
        return this.piece;
    }
    p.getCount = function() {
        return this.count;
    }
    return Mochigoma;
})();

// -------------------------------------------------------------------
// 成不成を確認する
// -------------------------------------------------------------------
function confirmPromote(myTeam, beforeMoveCol, beforeMoveRow) {

	console.log("=== selectedPiece(confirm) ==============");
	console.log("col      = "+selectedPiece.col);
	console.log("row      = "+selectedPiece.row);
	console.log("position = "+selectedPiece.position);
	console.log("piece    = "+selectedPiece.piece);

	if (currentTurn === SENTE_TEAM){
		// 成に自動決定
		if ((selectedPiece.piece == FU) && (beforeMoveRow == 1)){
			myTeam[selectedPiece.position].piece = TOKIN;
			selectedPiece.piece = TOKIN;
			removeSelection2(selectedPiece, SENTE_TEAM);
			return;
		}else if ((selectedPiece.piece == KYO) && (beforeMoveRow == 1)){
			myTeam[selectedPiece.position].piece = NARIKYO;
			selectedPiece.piece = NARIKYO;
			removeSelection2(selectedPiece, SENTE_TEAM);
			return;
		}else if ((selectedPiece.piece == KEI) && (beforeMoveRow <= 2)){
			myTeam[selectedPiece.position].piece = NARIKEI;
			selectedPiece.piece = NARIKEI;
			removeSelection2(selectedPiece, SENTE_TEAM);
			return;
		}

		// 成不成を選択
		if ((selectedPiece.row < 3) || (beforeMoveRow < 3)){
			switch (selectedPiece.piece){
				case FU:
				case KYO:
				case KEI:
				case GIN:
				case KAKU:
				case HISHA:
					$.confirm(selectedPiece)
						.done(function() {
							// 「はい」ボタンがクリックされた
							piece = $("#confirm").data("piece");
							switch (piece.piece){
							case FU:
								myTeam[piece.position].piece = TOKIN;
								piece.piece = TOKIN;
								break;
							case KYO:
								myTeam[piece.position].piece = NARIKYO;
								piece.piece = NARIKYO;
								break;
							case KEI:
								myTeam[piece.position].piece = NARIKEI;
								piece.piece = NARIKEI;
								break;
							case GIN:
								myTeam[piece.position].piece = NARIGIN;
								piece.piece = NARIGIN;
								break;
							case KAKU:
								myTeam[piece.position].piece = UMA;
								piece.piece = UMA;
								break;
							case HISHA:
								myTeam[piece.position].piece = RYU;
								piece.piece = RYU;
								break;
							}
							removeSelection2(piece, SENTE_TEAM);
						} )
						.fail(function() {
							// 「いいえ」ボタンや「×」ボタンがクリックされた
							piece = $("#confirm").data("piece");
							removeSelection2(piece, SENTE_TEAM);
						});
			}
		}
	}else{
		// 成に自動決定
		if ((selectedPiece.piece == FU) && (beforeMoveRow == 7)){
			myTeam[selectedPiece.position].piece = TOKIN;
			selectedPiece.piece = TOKIN;
			removeSelection2(selectedPiece, GOTE_TEAM);
			retrun;
		}else if ((selectedPiece.piece == KYO) && (beforeMoveRow == 7)){
			myTeam[selectedPiece.position].piece = NARIKYO;
			selectedPiece.piece = NARIKYO;
			removeSelection2(selectedPiece, GOTE_TEAM);
			return;
		}else if ((selectedPiece.piece == KEI) && (beforeMoveRow >= 6)){
			myTeam[selectedPiece.position].piece = NARIKEI;
			selectedPiece.piece = NARIKEI;
			removeSelection2(selectedPiece, GOTE_TEAM);
			return;
		}
		// 成不成を選択
		if ((selectedPiece.row > 5) || (beforeMoveRow > 5)){
			switch (selectedPiece.piece){
				case FU:
				case KYO:
				case KEI:
				case GIN:
				case KAKU:
				case HISHA:
					$.confirm(selectedPiece)
						.done(function() {
							// 「はい」ボタンがクリックされた
							piece = $("#confirm").data("piece");
							switch (piece.piece){
							case FU:
								myTeam[piece.position].piece = TOKIN;
								piece.piece = TOKIN;
								break;
							case KYO:
								myTeam[piece.position].piece = NARIKYO;
								piece.piece = NARIKYO;
								break;
							case KEI:
								myTeam[piece.position].piece = NARIKEI;
								piece.piece = NARIKEI;
								break;
							case GIN:
								myTeam[piece.position].piece = NARIGIN;
								piece.piece = NARIGIN;
								break;
							case KAKU:
								myTeam[piece.position].piece = UMA;
								piece.piece = UMA;
								break;
							case HISHA:
								myTeam[piece.position].piece = RYU;
								piece.piece = RYU;
								break;
							}
							removeSelection2(piece, GOTE_TEAM);
						} )
						.fail(function() {
							// 「いいえ」ボタンや「×」ボタンがクリックされた
							piece = $("#confirm").data("piece");
							removeSelection2(piece, GOTE_TEAM);
						});
			}
		}
	}
}


// -------------------------------------------------------------------
// Canvasの座標からブロック(行番号、カラム番号)に変換する
// 
// 座標系は左上起点(0, 0)
// x : 右方向
// y : 下方向
// 後手情報
// 持ち駒
// 盤 X=0-8
// y=0
// ...
//  y=8
// 先手持ち駒
// 後手情報
//　指し手
// 
// return : ブロック
// -------------------------------------------------------------------
function screenToBlock(x, y) {
	var block =  new Block(
		Math.floor(x / MASU_SIZE),
		// 上二段を駒台と情報アリアに使用
		Math.floor(y / MASU_SIZE　- 2)
	);

	return block;
}


// -------------------------------------------------------------------
// 左上をオリジンとする駒の初期表示位置を返す
// return : JSON { 手番 : [ 駒(種類, 行, 列, 状態) ] }
// -------------------------------------------------------------------
function defaultPositions() {
	json = {
		"sente":
			[
				{"piece": KYO,  "row": 8, "col": 0, "status": IN_PLAY },
				{"piece": KEI,  "row": 8, "col": 1, "status": IN_PLAY },
				{"piece": GIN,  "row": 8, "col": 2, "status": IN_PLAY },
				{"piece": KIN,  "row": 8, "col": 3, "status": IN_PLAY },
				{"piece": GYOKU,"row": 8, "col": 4, "status": IN_PLAY },
				{"piece": KIN,  "row": 8, "col": 5, "status": IN_PLAY },
				{"piece": GIN,  "row": 8, "col": 6, "status": IN_PLAY },
				{"piece": KEI,  "row": 8, "col": 7, "status": IN_PLAY },
				{"piece": KYO,  "row": 8, "col": 8, "status": IN_PLAY },
				{"piece": KAKU, "row": 7, "col": 1, "status": IN_PLAY },
				{"piece": HISHA,"row": 7, "col": 7, "status": IN_PLAY },
				{"piece": FU,   "row": 6, "col": 0, "status": IN_PLAY },
				{"piece": FU,   "row": 6, "col": 1, "status": IN_PLAY },
				{"piece": FU,   "row": 6, "col": 2, "status": IN_PLAY },
				{"piece": FU,   "row": 6, "col": 3, "status": IN_PLAY },
				{"piece": FU,   "row": 6, "col": 4, "status": IN_PLAY },
				{"piece": FU,   "row": 6, "col": 5, "status": IN_PLAY },
				{"piece": FU,   "row": 6, "col": 6, "status": IN_PLAY },
				{"piece": FU,   "row": 6, "col": 7, "status": IN_PLAY },
				{"piece": FU,   "row": 6, "col": 8, "status": IN_PLAY },
				{"piece": KYO,  "row": null, "col": null, "status": TAKEN },
				{"piece": KEI,  "row": null, "col": null, "status": TAKEN },
				{"piece": GIN,  "row": null, "col": null, "status": TAKEN },
				{"piece": KIN,  "row": null, "col": null, "status": TAKEN},
				{"piece": GYOKU,"row": null, "col": null, "status": TAKEN},
				{"piece": KIN,  "row": null, "col": null, "status": TAKEN },
				{"piece": GIN,  "row": null, "col": null, "status": TAKEN },
				{"piece": KEI,  "row": null, "col": null, "status": TAKEN },
				{"piece": KYO,  "row": null, "col": null, "status": TAKEN },
				{"piece": HISHA,"row": null, "col": null, "status": TAKEN },
				{"piece": KAKU, "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN }
			],
		"gote":
			[
				{"piece": KYO,  "row": null, "col": null, "status": TAKEN },
				{"piece": KEI,  "row": null, "col": null, "status": TAKEN },
				{"piece": GIN,  "row": null, "col": null, "status": TAKEN },
				{"piece": KIN,  "row": null, "col": null, "status": TAKEN},
				{"piece": GYOKU,"row": null, "col": null, "status": TAKEN},
				{"piece": KIN,  "row": null, "col": null, "status": TAKEN },
				{"piece": GIN,  "row": null, "col": null, "status": TAKEN },
				{"piece": KEI,  "row": null, "col": null, "status": TAKEN },
				{"piece": KYO,  "row": null, "col": null, "status": TAKEN },
				{"piece": HISHA,"row": null, "col": null, "status": TAKEN },
				{"piece": KAKU, "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": FU,   "row": null, "col": null, "status": TAKEN },
				{"piece": KYO,  "row": 0, "col": 0, "status": IN_PLAY },
				{"piece": KEI,  "row": 0, "col": 1, "status": IN_PLAY },
				{"piece": GIN,  "row": 0, "col": 2, "status": IN_PLAY },
				{"piece": KIN,  "row": 0, "col": 3, "status": IN_PLAY },
				{"piece": GYOKU,"row": 0, "col": 4, "status": IN_PLAY },
				{"piece": KIN,  "row": 0, "col": 5, "status": IN_PLAY },
				{"piece": GIN,  "row": 0, "col": 6, "status": IN_PLAY },
				{"piece": KEI,  "row": 0, "col": 7, "status": IN_PLAY },
				{"piece": KYO,  "row": 0, "col": 8, "status": IN_PLAY },
				{"piece": HISHA,"row": 1, "col": 1, "status": IN_PLAY },
				{"piece": KAKU, "row": 1, "col": 7, "status": IN_PLAY },
				{"piece": FU,   "row": 2, "col": 0, "status": IN_PLAY },
				{"piece": FU,   "row": 2, "col": 1, "status": IN_PLAY },
				{"piece": FU,   "row": 2, "col": 2, "status": IN_PLAY },
				{"piece": FU,   "row": 2, "col": 3, "status": IN_PLAY },
				{"piece": FU,   "row": 2, "col": 4, "status": IN_PLAY },
				{"piece": FU,   "row": 2, "col": 5, "status": IN_PLAY },
				{"piece": FU,   "row": 2, "col": 6, "status": IN_PLAY },
				{"piece": FU,   "row": 2, "col": 7, "status": IN_PLAY },
				{"piece": FU,   "row": 2, "col": 8, "status": IN_PLAY }
			]
	};
}


// -------------------------------------------------------------------
// 筋、段目をblock(col, row)に変換する
// 9筋 -> block : 0
// 9段目 -> row : 8
// -------------------------------------------------------------------
function convertToBlock(suji, danme){
	var block =  new Block(
		NUMBER_OF_SUJI - suji,
		danme - 1
	);

	return block;

}

// -------------------------------------------------------------------
// Blockをマスに変換する
// -------------------------------------------------------------------
function convertToMasu(col, row){
	var masu = new Masu( 
		NUMBER_OF_SUJI - col,
		row + 1
	);

	return masu;
}

// -------------------------------------------------------------------
// 駒を盤上に配置する
// curPiece : 駒コード
// bGoteTeam : 0: 先手番 1: 後手番 
// bPromote  : 0: 生駒 1: 成駒
// -------------------------------------------------------------------
function drawKoma(curPiece, bGoteTeam) {

	// 駒の座標を取得する
	var imageCoords = getImageCoords(curPiece.piece, bGoteTeam);

	// 駒を表示
	ctx.drawImage(pieces,
		// 駒画像の位置とサイズ
		imageCoords.x, imageCoords.y, IMG_BLOCK_SIZE, IMG_BLOCK_SIZE,
		// 盤上の表示位置とサイズ
		curPiece.col * MASU_SIZE, curPiece.row * MASU_SIZE + INFOAREA_SIZE + KOMADAI_SIZE, MASU_SIZE, MASU_SIZE);
}

// -------------------------------------------------------------------
// 持ち駒を盤上に配置する
// curPiece : 駒コード
// bGoteTeam : 0: 先手番 1: 後手番 
// bPromote  : 0: 生駒 1: 成駒
// -------------------------------------------------------------------
function drawMochigoma(curPiece, bGoteTeam) {
	if (bGoteTeam == true){
		mochigoma = getMochigomaSuite(curPiece, bGoteTeam);
		if (mochigoma==null){
			var mochigoma = new Mochigoma( 
				curPiece.piece,
				0
			);
			// 駒の座標を取得する
			var imageCoords = getMochigomaImageCoords(curPiece.piece, mochigoma.count);
			komadai = INFOAREA_SIZE;
			mochigomaSuiteConter = getMochigomaPosition(curPiece);
			// 駒を表示
			ctx.drawImage(pieces,
				// 駒画像の位置とサイズ
				imageCoords.x, imageCoords.y, IMG_BLOCK_SIZE, IMG_BLOCK_SIZE,
				// 盤上の表示位置とサイズ
				mochigomaSuiteConter * MASU_SIZE, komadai, MASU_SIZE, MASU_SIZE);
		}else{
			mochigomaSuiteConter = getMochigomaPosition(curPiece);
			goteMochigomaSuite[mochigomaSuiteConter] = mochigoma;
			mochigoma.count++;
			// 駒の座標を取得する
			var imageCoords = getMochigomaImageCoords(curPiece.piece, mochigoma.count);
			// 駒を表示
			ctx.drawImage(pieces,
				// 駒画像の位置とサイズ
				imageCoords.x, imageCoords.y, IMG_BLOCK_SIZE, IMG_BLOCK_SIZE,
				// 盤上の表示位置とサイズ
				mochigomaSuiteConter * MASU_SIZE, komadai, MASU_SIZE, MASU_SIZE);
		}
	} else {
		komadai = INFOAREA_SIZE + KOMADAI_SIZE + MASU_SIZE * NUMBER_OF_DANME;
		mochigoma = getMochigomaSuite(curPiece, !bGoteTeam);
		if (mochigoma == null){
			var mochigoma = new Mochigoma( 
				curPiece.piece,
				0
			);
			mochigoma.count++;
			// 駒の座標を取得する
			var imageCoords = getMochigomaImageCoords(curPiece.piece, mochigoma.count);
			mochigomaSuiteConter = getMochigomaPosition(curPiece);
			// 駒を表示
			ctx.drawImage(pieces,
				// 駒画像の位置とサイズ
				imageCoords.x, imageCoords.y, IMG_BLOCK_SIZE, IMG_BLOCK_SIZE,
				// 盤上の表示位置とサイズ
				mochigomaSuiteConter * MASU_SIZE, komadai, MASU_SIZE, MASU_SIZE);
		}else{
			mochigomaSuiteConter = getMochigomaPosition(curPiece);
			goteMochigomaSuite[senteMochigomaSuiteCounter] = mochigoma;
			mochigoma.count++;
			// 駒の座標を取得する
			var imageCoords = getMochigomaImageCoords(curPiece.piece, mochigoma.count);
			// 駒を表示
			ctx.drawImage(pieces,
				// 駒画像の位置とサイズ
				imageCoords.x, imageCoords.y, IMG_BLOCK_SIZE, IMG_BLOCK_SIZE,
				// 盤上の表示位置とサイズ
				mochigomaSuiteConter * MASU_SIZE, komadai, MASU_SIZE, MASU_SIZE);
		}
	}
}

// 同じ種類の持ち駒があるかの判定
function getMochigomaSuite(curPiece, bGoteTeam) {
	if (bGoteTeam){
		if (goteMochigomaSuite==null){
			return null;
		}
		for (var i=0; i<goteMochigomaSuite.length; i++){
			if (goteMochigomaSuite[i].piece == curPiece.piece){
				return goteMochigomaSuite[i];
			}
		}
	}else{
		if (senteMochigomaSuite==null){
			return null;
		}
		for (var i=0; i<senteMochigomaSuite.length; i++){
			if (senteMochigomaSuite[i].piece == curPiece.piece){
				return senteMochigomaSuite[i];
			}
		}
	}
	return null;
}

function getMochigomaPosition(piece) {
	switch (piece.piece){
	case FU :
		return 0;
	case KYO:
		return 1;
	case KEI:
		return 2;
	case GIN:
		return 3;
	case KIN:
		return 4;
	case KAKU:
		return 5;
	case HISHA:
		return 6;
	}
}


// -------------------------------------------------------------------
// 1マスを描画する
// 
// 座標系は右上が(1, 1)
// danme : 段目(1-9)
// suji  : 筋(1-9)
// -------------------------------------------------------------------
function drawMasu(suji, danme) {
	drawMasu2(suji, danme, BAN_COLOUR);
}


function drawMasu2(suji, danme, color) {
	// 右上起点(1,1)から左上起点(0,0)に変換
	var block = convertToBlock(suji, danme);

	ctx.clearRect(block.col * MASU_SIZE, block.row * MASU_SIZE + INFOAREA_SIZE + KOMADAI_SIZE,
		MASU_SIZE, MASU_SIZE);

	// 将棋盤の色を設定
	ctx.fillStyle = color;

	// マス目を塗りつぶし(始点、終点、幅、高さ)
	ctx.fillRect(block.col * MASU_SIZE, block.row * MASU_SIZE + INFOAREA_SIZE + KOMADAI_SIZE,
		MASU_SIZE, MASU_SIZE);

	ctx.fill();

	// 	枠線の幅
	ctx.lineWidth = DEFAULT_LINE_WIDTH;

	// マス目の輪郭の色を設定
	ctx.strokeStyle = MASU_RINKAKU_COLOUR;

	// マス目の輪郭を描画(始点、終点、幅、高さ)
	ctx.strokeRect(block.col * MASU_SIZE, block.row * MASU_SIZE + INFOAREA_SIZE + KOMADAI_SIZE,
		MASU_SIZE, MASU_SIZE);
	ctx.stroke();
}

// -------------------------------------------------------------------
// 駒を描画する
// teamOfPieces  : 先手駒、後手駒
// bGoteTeam : 後手番フラグ
// -------------------------------------------------------------------
function drawTeamOfKomatachi(teamOfPieces, bGoteTeam) {
	var iPieceCounter;

	// 指定された駒を描画する
	for (iPieceCounter = 0; iPieceCounter < teamOfPieces.length; iPieceCounter++) {
		if (teamOfPieces[iPieceCounter].status === IN_PLAY) {
			drawKoma(teamOfPieces[iPieceCounter], bGoteTeam);
		} else if  (teamOfPieces[iPieceCounter].status === MOCHIGOMA) {
			drawMochigoma(teamOfPieces[iPieceCounter], bGoteTeam);
		}
	}
}

// -------------------------------------------------------------------
// 駒たちを描画する
// -------------------------------------------------------------------
function drawKomatachi() {

	// 後手の駒たちを描画する
	drawTeamOfKomatachi(json.gote, true);

	// 先手の駒たちを描画する
	drawTeamOfKomatachi(json.sente, false);
}

// -------------------------------------------------------------------
// 段を描画する
// danme  : 段目。上からの行番号を表す(1-9)
// -------------------------------------------------------------------
function drawDanme(danme) {
	var suji;

	// 1筋から9筋までマスを描く
	for (suji = 1; suji <= NUMBER_OF_SUJI; suji++) {
		drawMasu(suji, danme);
	}
}

// -------------------------------------------------------------------
// 将棋盤を表示する
// 起点を1段目とし9段目まで表示する
// 
// 1 段目 (段毎の描画)
// 2 段目 (段毎の描画)
// --
// 9 段目 (段毎の描画)
// 
// -------------------------------------------------------------------
function drawBan() {
	var danme;

	// 1段目から順番に描画する
	for (danme = 1; danme <= NUMBER_OF_DANME; danme++) {
		drawDanme(danme);
	}

	drawWaku();
}

// -------------------------------------------------------------------
// 情報アリア表示
// -------------------------------------------------------------------
function drawInfoArea() {
	ctx.clearRect(0, 0, NUMBER_OF_SUJI * MASU_SIZE, INFOAREA_SIZE);

	// 情報エリアの色を設定
	ctx.fillStyle = INFO_AREA_COLOUR;

	// マス目を塗りつぶし(始点、終点、幅、高さ)
	ctx.fillRect(0, 0, NUMBER_OF_SUJI * MASU_SIZE, INFOAREA_SIZE);

	ctx.fill();

	// 	枠線の幅
	ctx.lineWidth = DEFAULT_LINE_WIDTH;

	// マス目の輪郭の色を設定
	ctx.strokeStyle = MASU_RINKAKU_COLOUR;

	// マス目の輪郭を描画(始点、終点、幅、高さ)
	ctx.strokeRect(0, 0, NUMBER_OF_SUJI * MASU_SIZE, INFOAREA_SIZE);

	ctx.stroke();
	;
}

// -------------------------------------------------------------------
// 駒台を描画
// -------------------------------------------------------------------
function drawKomadai() {
	ctx.clearRect(0, INFOAREA_SIZE, NUMBER_OF_SUJI * MASU_SIZE, INFOAREA_SIZE);

	// 情報エリアの色を設定
	ctx.fillStyle = KOMADAI_COLOUR;

	// マス目を塗りつぶし(始点、終点、幅、高さ)
	ctx.fillRect(0, INFOAREA_SIZE, NUMBER_OF_SUJI * MASU_SIZE, KOMADAI_SIZE);

	ctx.fill();

	// 	枠線の幅
	ctx.lineWidth = DEFAULT_LINE_WIDTH;

	// マス目の輪郭の色を設定
	ctx.strokeStyle = MASU_RINKAKU_COLOUR;

	// マス目の輪郭を描画(始点、終点、幅、高さ)
	ctx.strokeRect(0, INFOAREA_SIZE, NUMBER_OF_SUJI * MASU_SIZE, INFOAREA_SIZE);

	ctx.stroke();
	;

	ctx.clearRect(0, NUMBER_OF_DANME * MASU_SIZE + INFOAREA_SIZE + KOMADAI_SIZE, NUMBER_OF_SUJI * MASU_SIZE, INFOAREA_SIZE);

	// 情報エリアの色を設定
	ctx.fillStyle = KOMADAI_COLOUR;

	// マス目を塗りつぶし(始点、終点、幅、高さ)
	ctx.fillRect(0, NUMBER_OF_DANME * MASU_SIZE + INFOAREA_SIZE + KOMADAI_SIZE, NUMBER_OF_SUJI * MASU_SIZE, KOMADAI_SIZE);

	ctx.fill();

	// 	枠線の幅
	ctx.lineWidth = DEFAULT_LINE_WIDTH;

	// マス目の輪郭の色を設定
	ctx.strokeStyle = MASU_RINKAKU_COLOUR;

	// マス目の輪郭を描画(始点、終点、幅、高さ)
	ctx.strokeRect(0, NUMBER_OF_DANME * MASU_SIZE + INFOAREA_SIZE + KOMADAI_SIZE, NUMBER_OF_SUJI * MASU_SIZE, INFOAREA_SIZE);

	ctx.stroke();
	;
}


// -------------------------------------------------------------------
// 外枠を表示する
// -------------------------------------------------------------------
function drawWaku(){

	// マス目の輪郭の色を設定
	ctx.strokeStyle = MASU_RINKAKU_COLOUR;

	// 将棋盤の大外の枠を描画する
	ctx.lineWidth = WAKU_LINE_WIDTH;

console.log("ctx.strokeRect["+0+","+ (INFOAREA_SIZE + KOMADAI_SIZE)+","+
		(NUMBER_OF_DANME * MASU_SIZE)+","+
		(NUMBER_OF_SUJI * MASU_SIZE)+"]");

	ctx.strokeRect(0, INFOAREA_SIZE + KOMADAI_SIZE,
		NUMBER_OF_DANME * MASU_SIZE,
		NUMBER_OF_SUJI * MASU_SIZE);
}

// -------------------------------------------------------------------
// 駒の座標を取得する
//
// 駒イメージデータ内の駒配置は以下のようになっています。
// 成り駒の文字は棋譜DBを真似ました。
//         0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
// 先手 0 歩 香 桂 銀 金 角 飛 玉 と 杏 圭 全    馬 竜
// 後手 1 歩 香 桂 銀 金 角 飛 玉 と 杏 圭 全    馬 竜 
//
// pieceCode : 駒コード
// bGoteTeam : 0: 先手番 1: 後手番 
// bPromote  : 0: 生駒 1: 成駒
// return : 駒の座標
// -------------------------------------------------------------------
function getImageCoords(pieceCode, bGoteTeam) {

	var imageCoords =  {
		"x": pieceCode * IMG_BLOCK_SIZE,
		"y": (bGoteTeam ? IMG_BLOCK_SIZE  : 0)
	};

	return imageCoords;
}

// -------------------------------------------------------------------
// 持ち駒の座標を取得する
//
// 駒イメージデータ内の駒配置は以下のようになっています。
//    0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
// 2 歩 歩 歩 歩 歩 歩 歩 歩 歩 香 香 香 香
// 3 歩 歩 歩 歩 歩 歩 歩 歩 歩 桂 桂 桂 桂
// 4 銀 銀 銀 銀 金 金 金 金 角 角 飛 飛
//
// pieceCode : 駒コード
// num  : 駒数
// return : 駒の座標
// -------------------------------------------------------------------
function getMochigomaImageCoords(pieceCode, num) {

console.log("=== getMochigomaImageCoords ========================");
console.log("pieceCode="+pieceCode+", num="+num);

	switch (pieceCode) {
		case FU :
			if (num <= 9){
				x = (num - 1) * IMG_BLOCK_SIZE;
				y = IMG_BLOCK_SIZE * 2;
			}else{
				x = (num - 10) * IMG_BLOCK_SIZE;
				y = IMG_BLOCK_SIZE * 3;
			}
			break;
		case KYO :
			x = (num + 8) * IMG_BLOCK_SIZE;
			y = IMG_BLOCK_SIZE * 2;
			break;
		case KEI:
			x = (num + 8) * IMG_BLOCK_SIZE;
			y = IMG_BLOCK_SIZE * 3;
			break;
		case GIN:
			x = (num - 1) * IMG_BLOCK_SIZE;
			y = IMG_BLOCK_SIZE * 4;
			break;
		case KIN:
			x = (num + 3) * IMG_BLOCK_SIZE;
			y = IMG_BLOCK_SIZE * 4;
			break;
		case KAKU:
			x = (num + 7) * IMG_BLOCK_SIZE;
			y = IMG_BLOCK_SIZE * 4;
			break;
		case HISHA:
			x = (num + 9) * IMG_BLOCK_SIZE;
			y = IMG_BLOCK_SIZE * 4;
			break;
	}
	var imageCoords =  {
		"x": x, 
		"y": y
	};

	return imageCoords;
}

// -------------------------------------------------------------------
// 駒位置のマスをクリアする
// -------------------------------------------------------------------
function removeSelection(piece) {
	masu = convertToMasu(piece.col, piece.row);
	drawMasu(masu.suji, masu.danme);
	drawKoma(piece, (currentTurn === GOTE_TEAM));
}

function removeSelection2(piece, team) {
	masu = convertToMasu(piece.col, piece.row);
	drawMasu2(masu.suji, masu.danme, LAST_MOVE_COLOUR);
	drawKoma(piece, (team === GOTE_TEAM));
	drawWaku();
}

// -------------------------------------------------------------------
// 駒を選択する。選択した結果はselectedPieceに設定する。
// piece :  選択されたBlock位置
// -------------------------------------------------------------------
function selectPiece(piece) {
	// Draw outline
	ctx.lineWidth = SELECT_LINE_WIDTH;
	ctx.strokeStyle = HIGHLIGHT_COLOUR;
	ctx.strokeRect((piece.col * MASU_SIZE) + SELECT_LINE_WIDTH,
		(piece.row * MASU_SIZE) + INFOAREA_SIZE + KOMADAI_SIZE + SELECT_LINE_WIDTH,
		MASU_SIZE - (SELECT_LINE_WIDTH * 2),
		MASU_SIZE - (SELECT_LINE_WIDTH * 2));

	selectedPiece = piece;
}



// -------------------------------------------------------------------
// 盤をクリックされたイベントハンドラー
// 座標から駒を取得し、選択か移動に分岐する
// ev  : イベント
// -------------------------------------------------------------------
function board_click(ev) {
	var x = ev.clientX - canvas.offsetLeft,
		y = ev.clientY - canvas.offsetTop,
		
		block = screenToBlock(x, y);
		masu = convertToMasu(block.col, block.row);

	if (selectedPiece === null) {
		// 駒が選択されていない場合
		masu.checkIfPieceClicked();
	} else {
		// 駒を動かす
		masu.processMove();
	}
}


function draw() {

	// shogiのcanvasを取得
	canvas = document.getElementById('shogi');

	// Canvasをサポートしていないブラウザではalertを出力し終了
	if (canvas.getContext) {
	
		// 2D版
		ctx = canvas.getContext('2d');

		// 筋数と段目数は同じ想定
		// htmlで指定したCanvasの高さと段目の数から
		// マスの大きさを決定する
		MASU_SIZE = canvas.width / NUMBER_OF_DANME;
		INFOAREA_SIZE = MASU_SIZE;
		KOMADAI_SIZE = MASU_SIZE;

		// 情報アリア表示
		drawInfoArea();
		
		// 駒台を描画
		drawKomadai();
		
		// 盤を描画
		drawBan();

		// 駒の初期配置
		defaultPositions();

		// 駒を描画
		pieces = new Image();
		pieces.src = 'koganei_pieces.png';
		pieces.onload = drawKomatachi;

		canvas.addEventListener('click', board_click, false);
	} else {
		alert("Canvas not supported!");
	}
}