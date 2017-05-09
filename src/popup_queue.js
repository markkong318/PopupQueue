var PopupQueueObj = function(){
    var trigger_id = '';        // エレメントID
    var trigger_func = null;    // 普通でポップアップではない、funcより発動する
    var delay = 500;            // ポップの遅延時間
    var callback = null;        // ポップアップ完了時に実行
    var group_id = null;        // グループ記号

    // 制御系
    var is_unshift = false;     // キュー先頭から挿入するフラグ
    var keep_curr = false;      // 今ポップアップしてるの対象をキューに保存
    var close_curr = false;     // 今ポップアップしてるの対象を閉じる
}

var PopupQueue = function(){
    var _this = this

    this.queue = null;		    //ポップアップ記録用配列
    this.is_show = false;	    //今ポップアップの現れる状態
    this.is_first_show = false; //今は自分だけ初めてキューにプッシュする
    this.curr_obj = null;	    //今ポップアップしてるの対象

    this.init();

    $(window).bind('show_popup', function(event, options){

        var trigger_id = options.trigger_id;
        var trigger_func = (options.trigger_func != undefined ? options.trigger_func : null)
        var is_unshift = (options.is_unshift != undefined ? options.is_unshift : false);
        var keep_curr = (options.keep_curr != undefined ? options.keep_curr : false);
        var close_curr = (options.close_curr != undefined ? options.close_curr : false);
        var delay = (options.delay != undefined ? options.delay : 500);
        var callback = (options.callback != undefined ? options.callback : function(){});
        var group_id = (options.group_id != undefined ? options.group_id : null);

        var ignore_exist_check = (options.ignore_exist_check != undefined ? options.ignore_exist_check : false);

        //存在しないエレメントは加入させない
        if(!ignore_exist_check) {
            if (!$("#" + trigger_id).length) {
                return;
            }
        }

        //配列に存在とかチェック
        var is_existed = false;
        _this.queue.forEach(function(element, index, array){
            if(element.trigger_id == trigger_id){
                is_existed = true;
            }
        });

        if(_this.curr_obj != null){
            if(_this.curr_obj.trigger_id == trigger_id){
                is_existed = true;
            }
        }

        if(is_existed){
            return;
        }

        var obj = new PopupQueueObj();
        obj.trigger_id = trigger_id;
        obj.trigger_func = trigger_func;
        obj.delay = delay;
        obj.callback = callback;
        obj.group_id = group_id;

        obj.is_unshift = is_unshift;
        obj.keep_curr = keep_curr;
        obj.close_curr = close_curr;

        _this.push(obj);

    });

    $(window).bind('close_popup', function(event, options){

        options = options || {};

        var trigger_id = (options.trigger_id != undefined ? options.trigger_id : undefined);
        var close_group = (options.close_group != undefined ? options.close_group : false);

        //同じグループのポップアップを全部閉じる
        if(close_group){

            var curr_group_id = _this.curr_obj.group_id;

            if(curr_group_id != null){
                var splice_count = 0;

                $.each(_this.queue, function(idx, obj){
                    if(obj.group_id == curr_group_id){
                        splice_count++;
                    }else{
                        return false;
                    }
                });

                _this.queue.splice(0, splice_count);
            }
        }

        //閉じる対象idと現在開いてるポップアップidをチェック
        if(trigger_id != undefined && _this.curr_obj != undefined){

            curr_target_id = $('#' + _this.curr_obj.trigger_id).data('target');
            close_target_id = $('#' + trigger_id).attr('id');

            if(close_target_id == curr_target_id){
                _this.pop();
            }

            return;
        }

        _this.pop();
    });
}

PopupQueue.prototype.init = function(){
    this.queue = new Array();
}


PopupQueue.prototype.push = function(obj){

    //現在表示してるポップアップはキューの先頭に再挿入する
    if(obj.keep_curr){
        if(this.curr_obj != null) {
            this.queue.unshift(this.curr_obj);
        }
    }

    //今回追加のポップアップはキューの先頭に挿入する
    if(obj.is_unshift){
        this.queue.unshift(obj);
    }else {
        this.queue.push(obj);
    }


    if(!this.is_show){

        //現在表示のポップアップがないので　自動的に一個をポップする
        this.is_first_show = true;
        this.pop();

    }else{

        //今のポップアップを閉じる
        if(obj.close_curr){

            var target = $("#" + this.curr_obj.trigger_id).data('target');

            $("#" + target).find('[data-dismiss="popup"]').first().click();
        }
    }

}

PopupQueue.prototype.pop = function(){

    var _this = this;
    var obj = this.queue.shift();

    if(obj != undefined) {
        _this.curr_obj = obj;

        var trigger_id = obj.trigger_id;
        var trigger_func = obj.trigger_func;
        var trigger_delay = obj.delay;
        var callback = obj.callback;

        //この前に誰も表示されない->すぐに表示する
        if(_this.is_first_show){
            _this.is_first_show = false;
            trigger_delay = 0;
        }

        _this.is_show = true;

        setTimeout(function(){

            //ポップアップ表示を発動
            if(trigger_func != null) {
                trigger_func();
            }else{
                $("#" + trigger_id).trigger("click");
            }

            callback($("#" + trigger_id));

        }, trigger_delay);
    }else{
        _this.is_show = false;
        _this.curr_obj = null;
    }
}


$(document).ready(function() {
    popup_queue = new PopupQueue();
});