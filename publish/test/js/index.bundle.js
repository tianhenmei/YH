(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PageMove = function () {
    function PageMove(options) {
        _classCallCheck(this, PageMove);

        this.data = {
            direction: {
                x: "down",
                y: "down"
            },
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: 0,
                y: 0
            },
            now: 0,
            last: 0,
            page: {
                up: {
                    last: (options.animation ? options.animation : "move") + "ULast",
                    now: (options.animation ? options.animation : "move") + "UNow"
                },
                down: {
                    last: (options.animation ? options.animation : "move") + "DLast",
                    now: (options.animation ? options.animation : "move") + "DNow"
                }
            },
            pageLength: $(".page").length,
            isMoving: false,
            clickStatus: false
        };
        this._initPageMoveEvent();
    }

    _createClass(PageMove, [{
        key: "pageMove",
        value: function pageMove(od, self) {
            $(".page").removeClass(self.data.page[self.data.direction.y].now + " " + self.data.page[self.data.direction.y].last + " " + self.data.page[od].now + " " + self.data.page[od].last + " pageCurrent").addClass("hide");
            $(".page" + self.data.now).removeClass("hide").addClass(self.data.page[self.data.direction.y].now + " pageCurrent");
            $(".page" + self.data.last).removeClass("hide").addClass(self.data.page[self.data.direction.y].last);
            setTimeout(function () {
                $(".page").removeClass(self.data.page[self.data.direction.y].now + " " + self.data.page[self.data.direction.y].last + " " + self.data.page[od].now + " " + self.data.page[od].last);
                $(".page" + self.data.last).addClass("hide");
                self.data.isMoving = false;
            }, 500);
        }
    }, {
        key: "_pageMoveCompute",
        value: function _pageMoveCompute(self) {
            var od = "down";
            self.data.last = self.data.now;
            if (self.data.direction.y == "up") {
                self.data.now++;
            } else {
                self.data.now--;
                od = "up";
            }
            if (self.data.now == self.data.pageLength - 1) {
                if (self.data.signStatus) {
                    if (self.data.last != self.data.pageLength) {
                        self.data.now = self.data.pageLength;
                    } else {
                        if (self.data.direction.y != "up") {
                            self.data.now--;
                        }
                    }
                }
            }
            if (!self.data.signStatus && self.data.now >= self.data.pageLength || self.data.signStatus && self.data.now > self.data.pageLength) {
                self.data.now = self.data.signStatus ? self.data.pageLength : self.data.pageLength - 1;
                self.data.last = self.data.now - 1;
                self.data.isMoving = false;
                return;
                self.data.now = 0;
            }
            if (self.data.now <= -1) {
                self.data.last = 1;
                self.data.now = 0;
                self.data.isMoving = false;
                return;
                if (self.data.signStatus) {
                    self.data.now = self.data.pageLength;
                } else {
                    self.data.now = self.data.pageLength - 1;
                }
            }
            self.pageMove(od, self);
        }
    }, {
        key: "_initPageMoveEvent",
        value: function _initPageMoveEvent() {
            var self = this;
            document.addEventListener("touchstart", function (ev) {
                var touch = ev.targetTouches[0];
                self.data.start.x = touch.clientX;
                self.data.start.y = touch.clientY;
            }, false);
            document.addEventListener("touchmove", function (ev) {
                ev.preventDefault();
                var touch = ev.targetTouches[0];
                self.data.end.x = touch.clientX;
                self.data.end.y = touch.clientY;
            }, false);
            document.addEventListener("touchend", function (ev) {
                var initdisc = 20,
                    disc = self.data.end.y == 0 ? false : Math.abs(self.data.end.y - self.data.start.y) > initdisc;
                self.data.direction.x = self.data.end.x - self.data.start.x > initdisc ? "down" : self.data.end.x - self.data.start.x < initdisc ? "up" : "down";
                self.data.direction.y = self.data.end.y - self.data.start.y > initdisc ? "down" : self.data.end.y - self.data.start.y < initdisc ? "up" : "down";
                if (!self.data.clickStatus && !self.data.isMoving && disc) {
                    self.data.isMoving = true;
                    self._pageMoveCompute(self);
                }
                self.data.start.x = 0;
                self.data.start.y = 0;
                self.data.end.x = 0;
                self.data.end.y = 0;
                self.data.clickStatus = false;
            }, false);
        }
    }]);

    return PageMove;
}();

$('[contenteditable]').removeAttr('contenteditable');

var YHEvent = function () {
    function YHEvent() {
        _classCallCheck(this, YHEvent);

        this.showElemements = $('[yh-show]');
        this.pageElemements = $('[yh-page]');
        this.initShowEvent();
        this.initPageEvent();
    }

    _createClass(YHEvent, [{
        key: "initShowEvent",
        value: function initShowEvent() {
            if (this.showElemements.length > 0) {
                this.showElemements.on('touchstart', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var elemID = $(this)[0].attributes['yh-show'].value,
                        elem = document.getElementById(elemID),
                        display = window.getComputedStyle(elem, null).getPropertyValue('display');

                    switch (display) {
                        case 'none':
                            elem.style.display = 'block';
                            break;
                        default:
                            elem.style.display = 'none';
                            break;
                    }
                });
            }
        }
    }, {
        key: "initPageEvent",
        value: function initPageEvent() {
            if (this.pageElemements.length > 0) {
                this.pageElemements.on('touchstart', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var now = parseInt($(this)[0].attributes['yh-page'].value),
                        od = 'down';
                    if (now != PM.data.now) {
                        PM.data.direction.y = "up";
                        if (now < PM.data.now) {
                            PM.data.direction.y = "down";
                            od = 'up';
                        }
                        PM.data.last = PM.data.now;
                        PM.data.now = now;
                        PM.data.clickStatus = true;
                        PM.pageMove(od, PM);
                    }
                });
            }
        }
    }]);

    return YHEvent;
}();

initYHEvent();
function initYHEvent() {
    var hrefElement = $('[href^="show-"],[href^="page-"]'),
        href = [],
        i = 0;
    for (i = 0; i < hrefElement.length; i++) {
        href = hrefElement[i].attributes['href'].value.split('-');
        hrefElement[i].setAttribute('href', 'javascript:void(0);');
        hrefElement[i].setAttribute('yh-' + href[0], href[1]);
    }
    if (hrefElement.length > 0) {
        new YHEvent();
    }
}

var elementStates = { "element34": [{ "type": "active", "classname": "element34-states0", "yh-number": "1", "yh-src": "http://localhost:9000/static/files/Yujb2l3kf-icri93Ove3_DzN.png" }], "element35": [{ "type": "active", "classname": "element35-states0", "yh-number": "N" }], "element53": [{ "type": "active", "classname": "element53-states0", "yh-number": "N", "yh-src": "http://localhost:9000/static/files/3F4MjQF8_2Nqv-zlu6Ot9Z3I.png" }], "element54": [{ "type": "active", "classname": "element54-states0", "yh-number": "1" }] };
console.log(elementStates);
initElementStatesEvent();
function initElementStatesEvent() {
    for (var id in elementStates) {
        for (var i = 0; i < elementStates[id].length; i++) {
            setELementState(elementStates[id][i], id);
        }
    }
}
function setELementState(elementState, id) {
    switch (elementState.type) {
        case 'active':
            (function (classname, yhnumber, src) {
                var current = $('#' + id + ' [yh-states]');
                if (src) {
                    current.attr('yh-old-src', current.attr('src'));
                }
                current.on('click', function (e) {
                    if ($(this).hasClass('yh-invalid')) {
                        return;
                    }
                    switch (yhnumber) {
                        case '1':
                            if (!$(this).hasClass(classname)) {
                                $(this).addClass(classname);
                                if (src) {
                                    $(this).attr('src', src);
                                }
                            }
                            break;
                        case 'N':
                            if ($(this).hasClass(classname)) {
                                $(this).removeClass(classname);
                                if (src) {
                                    $(this).attr('src', $(this).attr('yh-old-src'));
                                }
                            } else {
                                $(this).addClass(classname);
                                if (src) {
                                    $(this).attr('src', src);
                                }
                            }
                            break;
                    }
                });
            })(elementState.classname, elementState['yh-number'], elementState['yh-src']);
            break;
        case 'invalid':
            var now = new Date().getTime(),
                start = new Date(elementState['yh-valid-start']).getTime(),
                end = new Date(elementState['yh-valid-end']).getTime(),
                current = $('#' + id + ' [yh-states]');
            if (now < start || now > end) {
                switch (elementState['yh-valid-type']) {
                    case "stylechange":
                        current.addClass(elementState.classname + ' yh-invalid');
                        if (elementState['yh-src']) {
                            current.attr('src', elementState['yh-src']);
                        }
                        break;
                    case "hide":
                        $('#' + id).hide();
                        current.addClass('yh-invalid');
                        break;
                }
            }
            break;
    }
}

initTabEvent();
function initTabEvent() {
    $('[yh-tab-title]').on('touchstart', '> .yh-tab-one', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var index = $(this).index(),
            content = $(this).closest('[yh-tab-title]').siblings('[yh-tab-content]').children();

        $(this).siblings().removeClass('yh-tab-active');
        $(this).addClass('yh-tab-active');
        content.removeClass('yh-tab-active');
        content.eq(index).addClass('yh-tab-active');
    });
}

var PM = new PageMove({ animation: "move" });
},{}]},{},[1]);
