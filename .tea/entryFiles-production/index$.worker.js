(function () {
    'use strict';

    var ERuntimeRemoteObjectType;
    (function (ERuntimeRemoteObjectType) {
        ERuntimeRemoteObjectType["Object"] = "object";
        ERuntimeRemoteObjectType["Function"] = "function";
        ERuntimeRemoteObjectType["Undefined"] = "undefined";
        ERuntimeRemoteObjectType["String"] = "string";
        ERuntimeRemoteObjectType["Number"] = "number";
        ERuntimeRemoteObjectType["Boolean"] = "boolean";
        ERuntimeRemoteObjectType["Symbol"] = "Symbol";
        ERuntimeRemoteObjectType["Bigint"] = "bigint";
        ERuntimeRemoteObjectType["Wasm"] = "wasm";
    })(ERuntimeRemoteObjectType || (ERuntimeRemoteObjectType = {}));
    var ERuntimeRemoteObjectSubType;
    (function (ERuntimeRemoteObjectSubType) {
        ERuntimeRemoteObjectSubType["Error"] = "error";
        ERuntimeRemoteObjectSubType["Array"] = "array";
        ERuntimeRemoteObjectSubType["Null"] = "null";
    })(ERuntimeRemoteObjectSubType || (ERuntimeRemoteObjectSubType = {}));

    var appxStackLine = /https:\/\/appx\/af-appx\.worker\.min\.js:\d+:\d+/;
    var nativeScriptLine = /https:\/\/www\.alipay\.com\/?:\d+:\d+|\[native code\]/;
    var pluginWorkerStackLine = /https:\/\/\d+\.hybrid\.\S+\.com\/__plugins__\/(\d+)\/index\.worker\.js:\d+:\d+/;
    var appWorkerStackLine = /https:\/\/\d+\.hybrid\.\S+\.com\/index\.worker\.js:\d+:\d+/;
    function transformSourceUrl(stackLine) {
        try {
            if (pluginWorkerStackLine.test(stackLine)) {
                return stackLine.replace(pluginWorkerStackLine, 'Plugin-$1');
            }
            return stackLine.replace(appWorkerStackLine, 'App');
        }
        catch (error) {
            return stackLine;
        }
    }
    function formatStack(stack) {
        var lines = stack.split('\n');
        var firstLine = lines[0];
        var stackLines = lines.slice(1);
        var newStacks = stackLines
            .filter(function (line) { return !appxStackLine.test(line) && !nativeScriptLine.test(line); })
            .map(transformSourceUrl)
            .map(function (line) { return line[0] === ' ' ? line : "    " + line; });
        newStacks.unshift(firstLine);
        return newStacks.join('\n');
    }
    function error2RemoteObject(errorObject) {
        var name = errorObject.name, message = errorObject.message, stack = errorObject.stack;
        if (typeof stack !== 'string') {
            stack = errorObject.toString();
        }
        if (stack.indexOf(name) === -1) {
            stack = errorObject.toString() + "\n" + stack;
        }
        try {
            stack = formatStack(stack);
        }
        catch (error) { }
        return {
            className: name,
            description: stack,
            preview: {
                description: stack,
                overflow: false,
                properties: [{
                        name: 'stack',
                        type: ERuntimeRemoteObjectType.String,
                        value: stack,
                    }, {
                        name: 'message',
                        type: ERuntimeRemoteObjectType.String,
                        value: message,
                    }],
                subtype: ERuntimeRemoteObjectSubType.Error,
                type: ERuntimeRemoteObjectType.Object,
            },
            subtype: ERuntimeRemoteObjectSubType.Error,
            type: ERuntimeRemoteObjectType.Object,
        };
    }

    function isError(target) {
        try {
            return Object.prototype.toString.call(target) === '[object Error]';
        }
        catch (error) {
            return false;
        }
    }
    function getStartupParams() {
        if (typeof __appxStartupParams !== 'undefined' && __appxStartupParams && __appxStartupParams.appId) {
            return __appxStartupParams;
        }
        if (typeof my !== 'undefined') {
            try {
                return my.callSync('getStartupParams') || {};
            }
            catch (error) { }
        }
        return {};
    }
    var serverConfig = {
        default: {
            domain: 'hpmweb.alipay.com',
        },
        1: {
            domain: 'hpmweb.alipay.com',
        },
    };
    function getServerConfig() {
        var remoteCh = getStartupParams().remoteCh;
        if (remoteCh && serverConfig[remoteCh]) {
            return serverConfig[remoteCh];
        }
        return serverConfig.default;
    }

    var ResponseEvent;
    (function (ResponseEvent) {
        ResponseEvent["ById"] = "Tyro.byId";
        ResponseEvent["Sticky"] = "Tyro.sticky";
        ResponseEvent["StickyNotSendPaused"] = "Tyro.stickyNotSendPaused";
        ResponseEvent["StickyAsync"] = "Tyro.stickyAsync";
        ResponseEvent["ScriptSource"] = "Tyro.scriptSource";
        ResponseEvent["Resumed"] = "Debugger.resumed";
        ResponseEvent["ConsoleAPICalled"] = "Runtime.consoleAPICalled";
    })(ResponseEvent || (ResponseEvent = {}));
    var RequestMethod;
    (function (RequestMethod) {
        RequestMethod["DiscardConsoleEntries"] = "Tyro.discardConsoleEntries";
        RequestMethod["Evaluate"] = "Tyro.evaluate";
        RequestMethod["EvaluateOnCallFrame"] = "Tyro.evaluateOnCallFrame";
        RequestMethod["CallFunctionOn"] = "Tyro.callFunctionOn";
        RequestMethod["CompileScript"] = "Tyro.compileScript";
        RequestMethod["SetBreakpointsActive"] = "Tyro.setBreakpointsActive";
        RequestMethod["SetSkipAllPauses"] = "Tyro.setSkipAllPauses";
        RequestMethod["Resume"] = "Tyro.resume";
        RequestMethod["StepInto"] = "Tyro.stepInto";
        RequestMethod["StepOver"] = "Tyro.stepOver";
        RequestMethod["StepOut"] = "Tyro.stepOut";
        RequestMethod["Pause"] = "Tyro.pause";
        RequestMethod["GetPossibleBreakpoints"] = "Tyro.getPossibleBreakpoints";
        RequestMethod["SetBreakpointByUrl"] = "Tyro.setBreakpointByUrl";
        RequestMethod["SetBreakpoint"] = "Tyro.setBreakpoint";
        RequestMethod["RemoveBreakpoint"] = "Tyro.removeBreakpoint";
        RequestMethod["REPL"] = "Tyro.repl";
        RequestMethod["GetVariableValue"] = "Tyro.getVariableValue";
        RequestMethod["SetPauseOnExceptions"] = "Tyro.setPauseOnExceptions";
        RequestMethod["SetAsyncCallStackDepth"] = "Tyro.setAsyncCallStackDepth";
        RequestMethod["GetProperties"] = "Tyro.getProperties";
    })(RequestMethod || (RequestMethod = {}));
    var BreakStepType;
    (function (BreakStepType) {
        BreakStepType[BreakStepType["Non"] = 0] = "Non";
        BreakStepType[BreakStepType["NextSticky"] = 1] = "NextSticky";
        BreakStepType[BreakStepType["StepOver"] = 2] = "StepOver";
        BreakStepType[BreakStepType["StepOut"] = 3] = "StepOut";
    })(BreakStepType || (BreakStepType = {}));
    var FingerType;
    (function (FingerType) {
        FingerType[FingerType["Entry"] = 0] = "Entry";
        FingerType[FingerType["Exit"] = 1] = "Exit";
    })(FingerType || (FingerType = {}));
    var TyroUtil = (function () {
        function TyroUtil() {
        }
        TyroUtil.throwsMessage = function (err) {
            return '[Throws: ' + (err ? err.message : '?') + ']';
        };
        TyroUtil.safeGetValueFromPropertyOnObject = function (obj, property) {
            if (Object.prototype.hasOwnProperty.call(obj, property)) {
                try {
                    return obj[property];
                }
                catch (err) {
                    return TyroUtil.throwsMessage(err);
                }
            }
            return obj[property];
        };
        TyroUtil.ensureProperties = function (obj) {
            var seen = [];
            function visit(obj) {
                if (obj === null || typeof obj !== 'object') {
                    return obj;
                }
                if (seen.indexOf(obj) !== -1) {
                    return '[Circular]';
                }
                seen.push(obj);
                if (typeof obj.toJSON === 'function') {
                    try {
                        var fResult = visit(obj.toJSON());
                        seen.pop();
                        return fResult;
                    }
                    catch (err) {
                        return TyroUtil.throwsMessage(err);
                    }
                }
                if (Array.isArray(obj)) {
                    var aResult = obj.map(visit);
                    seen.pop();
                    return aResult;
                }
                var result = Object.keys(obj).reduce(function (result, prop) {
                    result[prop] = visit(TyroUtil.safeGetValueFromPropertyOnObject(obj, prop));
                    return result;
                }, {});
                seen.pop();
                return result;
            }
            return visit(obj);
        };
        TyroUtil.safeJSONStringify = function (data, replacer, space) {
            return JSON.stringify(TyroUtil.ensureProperties(data), replacer, space);
        };
        TyroUtil.isWebIDE = function () {
            if (typeof navigator !== 'undefined' && navigator) {
                var ua = navigator.swuserAgent || navigator.userAgent || '';
                return ua.indexOf('AlipayIDE') > -1;
            }
            return false;
        };
        return TyroUtil;
    }());
    var StickyFinger = (function () {
        function StickyFinger(globalExecutionContext, host, instrumentId, rawContextJSON) {
            var _this = this;
            this.isWebIDE = false;
            this.asyncRequestMethod = 'tyroRequest';
            this.host = host;
            this.contextMap = {};
            this.contextUrlMap = {};
            this.breakpointMap = {};
            this.breakpointIdMap = {};
            this.debuggerMap = {};
            this.objectMap = {};
            this.originConsoleAPI = {};
            this.requestTaskId = 0;
            this.stickyMsgQueue = [];
            this.wsMsgQueue = [];
            this.wsIsOpen = false;
            this.instrumentId = instrumentId;
            this.stickyFlag = rawContextJSON.stickyFlag;
            this.fingerFlag = rawContextJSON.fingerFlag;
            this.hookConsole();
            if (this.stickyFlag) {
                setTimeout(function () {
                    _this.socketTask = my.connectSocket({
                        url: "wss://" + getServerConfig().domain + "/tyro/agent/" + _this.instrumentId,
                        multiple: true,
                    });
                    var handleSocketOpen = function () {
                        if (_this.wsIsOpen) {
                            return;
                        }
                        _this.originConsoleAPI.log("[tyro-agent] WebSocket \u8FDE\u63A5\u6210\u529F");
                        _this.wsIsOpen = true;
                        for (var _i = 0, _a = _this.wsMsgQueue; _i < _a.length; _i++) {
                            var msg = _a[_i];
                            _this.socketTask.send({
                                data: msg,
                            });
                        }
                        _this.wsMsgQueue = [];
                    };
                    _this.socketTask.onOpen(function () {
                        handleSocketOpen();
                    });
                    _this.socketTask.onClose(function () {
                        _this.originConsoleAPI.log("[tyro-agent] WebSocket \u8FDE\u63A5\u5DF2\u5173\u95ED");
                    });
                    _this.socketTask.onMessage(function (res) {
                        if (!_this.wsIsOpen) {
                            handleSocketOpen();
                        }
                        _this.handleStickyAsync(JSON.parse(res.data.data));
                    });
                }, 1200);
                this.breakpointsActive = true;
                this.skipAllPauses = false;
                this.breakStepType = BreakStepType.Non;
                this.stackDepth = 0;
                this.pauseOnExceptions = 'none';
                this.asyncCallStackDepth = 0;
                this.lastStickyAsyncError = 0;
                this.generateObjectId = 0;
                this.globalExecutionContext = globalExecutionContext;
                this.evaluateOnCallFrameExpression = '';
                this.stickyNotSendPaused = false;
                this.sendStickyParams = false;
            }
            if (this.fingerFlag) {
                this.fingerId = 0;
                this.fingerCache = [];
                this.fingerSendInterval = 1000;
                this.jsapiCallId = 0;
                setInterval(function () {
                    if (_this.fingerCache.length === 0) {
                        return;
                    }
                    _this.sendPerf('Perf.trace', _this.fingerCache);
                    _this.fingerCache = [];
                }, this.fingerSendInterval);
            }
            this.isWebIDE = TyroUtil.isWebIDE();
            if (this.isWebIDE) {
                this.asyncRequestMethod = 'tyroRequestAsync';
            }
        }
        StickyFinger.rewritePath = function (rawPath) {
            var path = rawPath;
            if (path[0] === '.') {
                path = path.replace('.', '');
            }
            path = path.replace('tmp/data/build/', '');
            path = 'app://' + path;
            return path;
        };
        StickyFinger.processRawContext = function (rawContextJSON) {
            var context = {
                path: this.rewritePath(rawContextJSON.path),
                contextId: String(rawContextJSON.contextId),
                scope: {
                    '0': [],
                },
                function: {},
                debuggerLine: rawContextJSON.debuggerLine,
                stickyLine: rawContextJSON.stickyLine,
            };
            if (rawContextJSON.scope) {
                Object.keys(rawContextJSON.scope).map(function (uid) {
                    var bindings = rawContextJSON.scope[uid];
                    var parentUid = bindings.shift();
                    var parentBindings = context.scope[parentUid];
                    if (parentBindings) {
                        context.scope[uid] = parentBindings.concat(bindings.filter(function (variable) {
                            return parentBindings.indexOf(variable) < 0;
                        }));
                    }
                    else {
                        context.scope[uid] = bindings;
                    }
                });
            }
            if (rawContextJSON.function) {
                Object.keys(rawContextJSON.function).map(function (uid) {
                    var items = rawContextJSON.function[uid];
                    context.function[uid] = {
                        name: items[0],
                        line: items[1],
                    };
                });
            }
            return context;
        };
        StickyFinger.prototype.register = function (rawContextJSON, sourceCode) {
            var contextId = String(rawContextJSON.contextId);
            var path = StickyFinger.rewritePath(rawContextJSON.path);
            this.originConsoleAPI.log("[tyro-agent] register contextId " + contextId + " path " + path);
            if (this.contextMap[contextId] || this.breakpointMap[contextId]) {
                this.originConsoleAPI.warn("[tyro-agent] duplicate context register " + contextId + " " + path);
                return;
            }
            this.contextMap[contextId] = StickyFinger.processRawContext(rawContextJSON);
            this.contextUrlMap[path] = contextId;
            this.breakpointMap[contextId] = {};
            this.debuggerMap[contextId] = this.contextMap[contextId].debuggerLine.reduce(function (ob, line) { return ((ob[line - 1] = true), ob); }, {});
            if (this.stickyFlag) {
                this.xhrSend(ResponseEvent.ScriptSource, {
                    scriptSource: sourceCode,
                    scriptId: String(contextId),
                    executionContextId: 0,
                    url: path,
                });
            }
        };
        StickyFinger.prototype.sticky = function (contextId, line, scopeUid) {
            if (this.skipAllPauses) {
                return;
            }
            if (!this.breakpointsActive) {
                return;
            }
            if (this.debuggerMap[contextId][line] ||
                this.breakpointMap[contextId][line] ||
                this.breakStepType === BreakStepType.NextSticky ||
                (this.breakStepType === BreakStepType.StepOver && new Error().stack.split('\n').length <= this.stackDepth) ||
                (this.breakStepType === BreakStepType.StepOut && new Error().stack.split('\n').length < this.stackDepth) ||
                this.sendStickyParams === true) {
                this.originConsoleAPI.log("[tyro-agent] sticky " + contextId + " " + line);
                this.breakStepType = BreakStepType.Non;
                var params = {};
                if (this.stickyNotSendPaused) {
                    this.originConsoleAPI.log("[tyro-agent] stickyNotSendPaused");
                }
                else if (!this.sendStickyParams) {
                    this.originConsoleAPI.log("[tyro-agent] sticky sendStickyParams step 1");
                    params = {
                        callFrames: null,
                        reason: 'other',
                        hitBreakpoints: [],
                    };
                    var breakpointId = this.breakpointMap[contextId][line];
                    if (breakpointId) {
                        params.hitBreakpoints.push(breakpointId);
                    }
                    var stacktrace = new Error().stack;
                    var splits = stacktrace.split('\n');
                    this.stackDepth = splits.length;
                    if (Agent.isPhone) {
                        params.callFrames = this.processCallFramesPhone(String(contextId), line, scopeUid, splits);
                    }
                    else {
                        params.callFrames = this.processCallFrames(String(contextId), line, scopeUid, splits);
                    }
                    this.stickyParams = params;
                    this.sendStickyParams = true;
                    return "(() => {\n          const localObject = {};\n          for (const key of Agent.getScopeVariables()) {\n            localObject[key] = (() => {try{return eval(key)}catch(e){return undefined}})();\n          }\n          Agent.inflateStickyParamsObject(localObject);\n          return true;\n        })()";
                }
                else {
                    this.originConsoleAPI.log("[tyro-agent] sticky sendStickyParams step 2");
                    params = this.stickyParams;
                    this.sendStickyParams = false;
                }
                this.originConsoleAPI.log("[tyro-agent] sticky params " + TyroUtil.safeJSONStringify(params));
                var stickyResponse = JSON.parse(this.xhrSend(ResponseEvent.Sticky, params));
                return this.handleSticky(stickyResponse);
            }
        };
        StickyFinger.prototype.fingerEntry = function (contextId, scopeUid) {
            var path = this.contextMap[contextId].path;
            var functionDetail = this.contextMap[contextId].function[scopeUid];
            var fingerId = this.generateFingerId();
            var trace = {
                time: Date.now(),
                file: path,
                line: functionDetail.line,
                name: functionDetail.name,
                id: fingerId,
                type: FingerType.Entry,
            };
            this.fingerCache.push(trace);
            return fingerId;
        };
        StickyFinger.prototype.fingerExit = function (contextId, scopeUid, fingerId) {
            var path = this.contextMap[contextId].path;
            var functionDetail = this.contextMap[contextId].function[scopeUid];
            var trace = {
                time: Date.now(),
                file: path,
                line: functionDetail.line,
                name: functionDetail.name,
                id: fingerId,
                type: FingerType.Exit,
            };
            this.fingerCache.push(trace);
        };
        StickyFinger.prototype.sendPerf = function (method, params) {
            if (self.bugmeAPI) {
                self.bugmeAPI.send({
                    method: method,
                    params: params,
                });
            }
            else {
                if (self.document) {
                    self.document.addEventListener('bugmeInjected', function () {
                        self.bugmeAPI.send({
                            method: method,
                            params: params,
                        });
                    });
                }
                else if (self.addEventListener) {
                    self.addEventListener('bugmeInjected', function () {
                        self.bugmeAPI.send({
                            method: method,
                            params: params,
                        });
                    });
                }
            }
        };
        StickyFinger.prototype.hookConsole = function () {
            var _this = this;
            this.originConsoleAPI.log = console.log.bind(console);
            this.originConsoleAPI.debug = console.debug.bind(console);
            this.originConsoleAPI.info = console.info.bind(console);
            this.originConsoleAPI.error = console.error.bind(console);
            this.originConsoleAPI.warn = console.warn.bind(console);
            console.log = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = _this.originConsoleAPI).log.apply(_a, args);
                if (args.length > 0 &&
                    typeof args[0] === 'string' &&
                    (args[0].indexOf('[framework]') >= 0 ||
                        args[0].indexOf('dispatchEvent') >= 0 ||
                        args[0].indexOf('onMessage push') >= 0)) {
                    return;
                }
                var params = {
                    type: 'log',
                    args: args.map(function (v) { return _this.objectToRemoteObject(v, null, typeof v === 'object'); }),
                    executionContextId: 0,
                    timestamp: new Date().getTime(),
                };
                _this.xhrSend(ResponseEvent.ConsoleAPICalled, params, null, false);
            };
            console.debug = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = _this.originConsoleAPI).debug.apply(_a, args);
                if (args.length > 0 &&
                    typeof args[0] === 'string' &&
                    (args[0].indexOf('[framework]') >= 0 ||
                        args[0].indexOf('dispatchEvent') >= 0 ||
                        args[0].indexOf('onMessage push') >= 0)) {
                    return;
                }
                var params = {
                    type: 'debug',
                    args: args.map(function (v) { return _this.objectToRemoteObject(v, null, typeof v === 'object'); }),
                    executionContextId: 0,
                    timestamp: new Date().getTime(),
                };
                _this.xhrSend(ResponseEvent.ConsoleAPICalled, params, null, false);
            };
            console.info = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = _this.originConsoleAPI).info.apply(_a, args);
                if (args.length > 0 &&
                    typeof args[0] === 'string' &&
                    (args[0].indexOf('[framework]') >= 0 ||
                        args[0].indexOf('dispatchEvent') >= 0 ||
                        args[0].indexOf('onMessage push') >= 0)) {
                    return;
                }
                var params = {
                    type: 'info',
                    args: args.map(function (v) { return _this.objectToRemoteObject(v, null, typeof v === 'object'); }),
                    executionContextId: 0,
                    timestamp: new Date().getTime(),
                };
                _this.xhrSend(ResponseEvent.ConsoleAPICalled, params, null, false);
            };
            console.error = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = _this.originConsoleAPI).error.apply(_a, args);
                if (args.length > 0 &&
                    typeof args[0] === 'string' &&
                    (args[0].indexOf('[framework]') >= 0 ||
                        args[0].indexOf('dispatchEvent') >= 0 ||
                        args[0].indexOf('onMessage push') >= 0)) {
                    return;
                }
                var params = {
                    type: 'error',
                    args: args.map(function (v) { return _this.objectToRemoteObject(v, null, typeof v === 'object'); }),
                    executionContextId: 0,
                    timestamp: new Date().getTime(),
                };
                _this.xhrSend(ResponseEvent.ConsoleAPICalled, params, null, false);
            };
            console.warn = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = _this.originConsoleAPI).warn.apply(_a, args);
                if (args.length > 0 &&
                    typeof args[0] === 'string' &&
                    (args[0].indexOf('[framework]') >= 0 ||
                        args[0].indexOf('dispatchEvent') >= 0 ||
                        args[0].indexOf('onMessage push') >= 0)) {
                    return;
                }
                var params = {
                    type: 'warning',
                    args: args.map(function (v) { return _this.objectToRemoteObject(v, null, typeof v === 'object'); }),
                    executionContextId: 0,
                    timestamp: new Date().getTime(),
                };
                _this.xhrSend(ResponseEvent.ConsoleAPICalled, params, null, false);
            };
        };
        StickyFinger.prototype.inflateStickyParamsObject = function (inflateObject) {
            if (this.stickyParams.callFrames.length === 0) {
                return;
            }
            this.generateObjectId += 1;
            var objectId = String(this.generateObjectId);
            this.objectMap[objectId] = inflateObject;
            this.stickyParams.callFrames[0].scopeChain.push({
                type: 'local',
                name: this.stickyParams.callFrames[0].functionName,
                object: {
                    className: 'Object',
                    description: 'Object',
                    objectId: objectId,
                    type: 'object',
                },
            });
        };
        StickyFinger.prototype.processCallFrames = function (contextId, line, scopeUid, stacktrace) {
            var _this = this;
            var callFrames = [];
            var realStacktrace = stacktrace.slice(3, stacktrace.length).map(function (v) {
                return v
                    .substr(0, v.lastIndexOf(':'))
                    .replace('    at ', '')
                    .replace(' (', ':');
            });
            var idCount = 0;
            var scopeVariablesOnlyLocal = true;
            realStacktrace.map(function (stacktrace) {
                var latestFrameSplits = stacktrace.split(':');
                var functionName = latestFrameSplits[0];
                var url = _this.contextMap[contextId].path;
                var lineNumber = Number(latestFrameSplits[latestFrameSplits.length - 1]);
                var scriptId = _this.contextUrlMap[url] || 'none';
                var callFrameId = idCount + ":" + lineNumber + ":" + url;
                var scopeChain = [];
                if (scopeVariablesOnlyLocal) {
                    _this.scopeVariables =
                        _this.contextMap[contextId] !== undefined ? _this.contextMap[contextId].scope[scopeUid] : [];
                    scopeVariablesOnlyLocal = false;
                }
                var callFrame = {
                    callFrameId: callFrameId,
                    functionName: functionName,
                    location: {
                        scriptId: scriptId,
                        lineNumber: lineNumber,
                        columnNumber: 0,
                    },
                    url: url,
                    scopeChain: scopeChain,
                    this: {},
                };
                callFrames.push(callFrame);
                idCount += 1;
            });
            return callFrames;
        };
        StickyFinger.prototype.processCallFramesPhone = function (contextId, line, scopeUid, stacktrace) {
            var _this = this;
            var callFrames = [];
            var realStacktrace = stacktrace.slice(2, stacktrace.length).map(function (v) {
                return v
                    .substr(0, v.lastIndexOf(':'))
                    .replace('    at ', '')
                    .replace(' (', ':')
                    .replace('@', ':');
            });
            var idCount = 0;
            var scopeVariablesOnlyLocal = true;
            realStacktrace.map(function (stacktrace) {
                var latestFrameSplits = stacktrace.split(':');
                var functionName = latestFrameSplits[0];
                var url = _this.contextMap[contextId].path;
                var lineNumber = Number(latestFrameSplits[latestFrameSplits.length - 1]);
                var scriptId = _this.contextUrlMap[url] || 'none';
                var callFrameId = idCount + ":" + lineNumber + ":" + url;
                var scopeChain = [];
                if (scopeVariablesOnlyLocal) {
                    _this.scopeVariables =
                        _this.contextMap[contextId] !== undefined ? _this.contextMap[contextId].scope[scopeUid] : [];
                    _this.originConsoleAPI.log("scopeVariables " + TyroUtil.safeJSONStringify(_this.scopeVariables));
                    _this.originConsoleAPI.log("scopeVariables " + TyroUtil.safeJSONStringify(_this.contextMap[contextId]) + " " + _this.contextMap[contextId].scope + " " + scopeUid);
                    scopeVariablesOnlyLocal = false;
                }
                var callFrame = {
                    callFrameId: callFrameId,
                    functionName: functionName,
                    location: {
                        scriptId: scriptId,
                        lineNumber: line,
                        columnNumber: 0,
                    },
                    url: url,
                    scopeChain: scopeChain,
                    this: {},
                };
                callFrames.push(callFrame);
                idCount += 1;
            });
            return callFrames;
        };
        StickyFinger.prototype.stickyAsyncLoop = function () {
            this.xhrSend(ResponseEvent.StickyAsync, {});
        };
        StickyFinger.prototype.xhrSendJSAPI = function (event, params, id, stickyQueue) {
            var _this = this;
            if (event === ResponseEvent.Sticky) {
                var msg_1;
                if (this.stickyMsgQueue.length > 0) {
                    this.stickyMsgQueue.push({
                        method: this.stickyNotSendPaused ? ResponseEvent.StickyNotSendPaused : ResponseEvent.Sticky,
                        params: params,
                    });
                    msg_1 = TyroUtil.safeJSONStringify(this.stickyMsgQueue);
                    this.stickyMsgQueue = [];
                }
                else {
                    msg_1 = TyroUtil.safeJSONStringify({
                        method: this.stickyNotSendPaused ? ResponseEvent.StickyNotSendPaused : ResponseEvent.Sticky,
                        params: params,
                    });
                }
                my.call('showRemoteDebugMask', {
                    text: ' ',
                    buttonTitle: '断点命中',
                    hide: false,
                });
                this.stickyNotSendPaused = false;
                var startTyroRequestTime = Date.now();
                var result = my.callSync('tyroRequest', {
                    url: this.host + '/tyro/agent',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'instrument-id': this.instrumentId,
                    },
                    data: msg_1,
                    timeout: 600000,
                    blockTimeout: 600000,
                    dataType: 'json',
                    requestTaskId: this.requestTaskId++,
                });
                my.call('showRemoteDebugMask', {
                    hide: true,
                });
                if (result.error || result === null) {
                    if (result === null) {
                        this.originConsoleAPI.error("[tyro-agent] xhrSend error result is " + result);
                    }
                    else {
                        this.originConsoleAPI.error("[tyro-agent] xhrSend error " + result.error + " " + result.errorMessage);
                    }
                    if (Date.now() - startTyroRequestTime >= 5000) {
                        return this.xhrSendJSAPI(event, params, id, stickyQueue);
                    }
                    else {
                        return TyroUtil.safeJSONStringify({
                            method: 'default',
                        });
                    }
                }
                else if (result.status !== 200) {
                    this.originConsoleAPI.error("[tyro-agent] xhrSend status fail " + event + " " + result.status);
                    return TyroUtil.safeJSONStringify({
                        method: 'default',
                    });
                }
                else {
                    return result.data;
                }
            }
            if (event === ResponseEvent.StickyAsync) {
                var msg_2 = TyroUtil.safeJSONStringify({
                    method: ResponseEvent.StickyAsync,
                    params: params,
                });
                this.originConsoleAPI.info("[tyro-agent] xhrSend async send " + msg_2);
                my.call(this.asyncRequestMethod, {
                    url: this.host + '/tyro/agent',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'instrument-id': this.instrumentId,
                    },
                    data: msg_2,
                    timeout: 600000,
                    dataType: 'json',
                    requestTaskId: this.requestTaskId++,
                    success: function (res) {
                        _this.lastStickyAsyncError = 0;
                        _this.stickyAsyncLoop();
                        if (res.status === 200) {
                            _this.originConsoleAPI.info("[tyro-agent] xhrSend async success " + res.status + " " + res.data);
                            _this.handleStickyAsync(JSON.parse(res.data));
                        }
                        else {
                            _this.originConsoleAPI.error("[tyro-agent] xhrSend async fail " + res.status + " " + res.data);
                        }
                    },
                    fail: function (err) {
                        if (_this.lastStickyAsyncError >= 3) {
                            setTimeout(function () {
                                _this.stickyAsyncLoop();
                            }, 3000);
                        }
                        else {
                            _this.lastStickyAsyncError += 1;
                            _this.stickyAsyncLoop();
                        }
                        _this.originConsoleAPI.error("[tyro-agent] xhrSend async error " + TyroUtil.safeJSONStringify(err));
                    },
                });
            }
            var msg;
            switch (event) {
                case ResponseEvent.ById: {
                    msg = {
                        id: id,
                        result: params,
                    };
                    break;
                }
                case ResponseEvent.ScriptSource: {
                    msg = {
                        method: ResponseEvent.ScriptSource,
                        params: params,
                    };
                    break;
                }
                case ResponseEvent.Resumed: {
                    msg = {
                        method: ResponseEvent.Resumed,
                        params: params,
                    };
                    break;
                }
                case ResponseEvent.ConsoleAPICalled: {
                    msg = {
                        method: ResponseEvent.ConsoleAPICalled,
                        params: params,
                    };
                    break;
                }
                default:
                    return;
            }
            if (stickyQueue) {
                this.stickyMsgQueue.push(msg);
                return;
            }
            if (this.wsIsOpen) {
                this.socketTask.send({
                    data: TyroUtil.safeJSONStringify(msg),
                });
            }
            else {
                this.wsMsgQueue.push(TyroUtil.safeJSONStringify(msg));
            }
        };
        StickyFinger.prototype.xhrSend = function (event, params, id, stickyQueue) {
            var _this = this;
            if (Agent.isPhone) {
                return this.xhrSendJSAPI(event, params, id, stickyQueue);
            }
            var xhr = new XMLHttpRequest();
            if (event === ResponseEvent.Sticky) {
                xhr.open('POST', this.host + '/tyro/agent', false);
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                xhr.setRequestHeader('instrument-id', this.instrumentId);
                var msg_3;
                if (this.stickyMsgQueue.length > 0) {
                    this.stickyMsgQueue.push({
                        method: this.stickyNotSendPaused ? ResponseEvent.StickyNotSendPaused : ResponseEvent.Sticky,
                        params: params,
                    });
                    try {
                        msg_3 = TyroUtil.safeJSONStringify(this.stickyMsgQueue);
                    }
                    catch (e) {
                        this.originConsoleAPI.error(e);
                        msg_3 = TyroUtil.safeJSONStringify({
                            method: this.stickyNotSendPaused ? ResponseEvent.StickyNotSendPaused : ResponseEvent.Sticky,
                            params: params,
                        });
                    }
                    finally {
                        this.stickyMsgQueue = [];
                    }
                }
                else {
                    msg_3 = TyroUtil.safeJSONStringify({
                        method: this.stickyNotSendPaused ? ResponseEvent.StickyNotSendPaused : ResponseEvent.Sticky,
                        params: params,
                    });
                }
                this.stickyNotSendPaused = false;
                xhr.send(msg_3);
                if (xhr.status === 200) {
                    return xhr.responseText;
                }
                else {
                    throw new Error("[sticky-finger] xhrSend error " + event + " " + xhr.status);
                }
            }
            if (event === ResponseEvent.StickyAsync) {
                xhr.open('POST', this.host + '/tyro/agent', true);
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                xhr.setRequestHeader('instrument-id', this.instrumentId);
                xhr.onload = function () {
                    _this.lastStickyAsyncError = 0;
                    _this.stickyAsyncLoop();
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        _this.handleStickyAsync(JSON.parse(xhr.responseText));
                    }
                    else {
                        throw new Error("[tyro-agent] xhrSend async fail " + event + " " + xhr.readyState + " " + xhr.status);
                    }
                };
                xhr.onerror = function () {
                    if (_this.lastStickyAsyncError >= 3) {
                        setTimeout(function () {
                            _this.stickyAsyncLoop();
                        }, 3000);
                    }
                    else {
                        _this.lastStickyAsyncError += 1;
                        _this.stickyAsyncLoop();
                    }
                    throw new Error("[tyro-agent] xhrSend async error " + event + " " + xhr.readyState + " " + xhr.status);
                };
                xhr.send(TyroUtil.safeJSONStringify({
                    method: ResponseEvent.StickyAsync,
                    params: params,
                }));
                return;
            }
            xhr.open('POST', this.host + '/tyro/agent', true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.setRequestHeader('instrument-id', this.instrumentId);
            xhr.onload = function () {
                if (xhr.readyState !== 4 || xhr.status !== 200) {
                    throw new Error("[tyro-agent] xhrSend async fail " + event + " " + xhr.readyState + " " + xhr.status);
                }
            };
            xhr.onerror = function () {
                throw new Error("[tyro-agent] xhrSend async error " + event + " " + xhr.readyState + " " + xhr.status);
            };
            var msg;
            switch (event) {
                case ResponseEvent.ById: {
                    msg = {
                        id: id,
                        result: params,
                    };
                    break;
                }
                case ResponseEvent.ScriptSource: {
                    msg = {
                        method: ResponseEvent.ScriptSource,
                        params: params,
                    };
                    break;
                }
                case ResponseEvent.Resumed: {
                    msg = {
                        method: ResponseEvent.Resumed,
                        params: params,
                    };
                    break;
                }
                case ResponseEvent.ConsoleAPICalled: {
                    msg = {
                        method: ResponseEvent.ConsoleAPICalled,
                        params: params,
                    };
                    break;
                }
                default:
                    return;
            }
            if (stickyQueue) {
                this.stickyMsgQueue.push(msg);
            }
            else {
                xhr.send(TyroUtil.safeJSONStringify(msg));
            }
        };
        StickyFinger.prototype.handleSticky = function (stickyResponse) {
            var id = stickyResponse.id;
            var method = stickyResponse.method;
            var params = stickyResponse.params;
            switch (method) {
                case RequestMethod.DiscardConsoleEntries: {
                    this.stickyNotSendPaused = true;
                    this.originConsoleAPI.log("[tyro-agent] DiscardConsoleEntries success");
                    return '(()=>{return true})()';
                }
                case RequestMethod.CallFunctionOn: {
                    this.stickyNotSendPaused = true;
                    this.originConsoleAPI.log("[tyro-agent] CallFunctionOn TODO sticky");
                    return '(()=>{return true})()';
                }
                case RequestMethod.CompileScript: {
                    this.stickyNotSendPaused = true;
                    this.originConsoleAPI.log("[tyro-agent] CompileScript success, " + TyroUtil.safeJSONStringify(params));
                    return '(()=>{return true})()';
                }
                case RequestMethod.SetBreakpointsActive: {
                    this.stickyNotSendPaused = true;
                    this.breakpointsActive = params.active;
                    this.originConsoleAPI.log("[tyro-agent] SetBreakpointsActive success, breakpointsActive " + this.breakpointsActive);
                    this.breakStepType = BreakStepType.NextSticky;
                    return '(()=>{return true})()';
                }
                case RequestMethod.SetSkipAllPauses: {
                    this.stickyNotSendPaused = true;
                    this.skipAllPauses = params.skip;
                    this.originConsoleAPI.log("[tyro-agent] SetSkipAllPauses success, skipAllPauses " + this.skipAllPauses);
                    this.breakStepType = BreakStepType.NextSticky;
                    return '(()=>{return true})()';
                }
                case RequestMethod.Resume: {
                    this.xhrSend(ResponseEvent.Resumed, {});
                    this.originConsoleAPI.log("[tyro-agent] Resume success");
                    return '(()=>{return false})()';
                }
                case RequestMethod.StepInto: {
                    this.xhrSend(ResponseEvent.Resumed, {});
                    this.breakStepType = BreakStepType.NextSticky;
                    this.originConsoleAPI.log("[tyro-agent] StepInto success");
                    return '(()=>{return false})()';
                }
                case RequestMethod.StepOver: {
                    this.xhrSend(ResponseEvent.Resumed, {});
                    this.breakStepType = BreakStepType.StepOver;
                    this.originConsoleAPI.log("[tyro-agent] StepOver success");
                    return '(()=>{return false})()';
                }
                case RequestMethod.StepOut: {
                    this.xhrSend(ResponseEvent.Resumed, {});
                    this.breakStepType = BreakStepType.StepOut;
                    this.originConsoleAPI.log("[tyro-agent] StepOut success");
                    return '(()=>{return false})()';
                }
                case RequestMethod.GetPossibleBreakpoints: {
                    this.stickyNotSendPaused = true;
                    this.getPossibleBreakpoints(id, params, true);
                    this.breakStepType = BreakStepType.NextSticky;
                    return '(()=>{return true})()';
                }
                case RequestMethod.SetBreakpointByUrl: {
                    this.stickyNotSendPaused = true;
                    this.setBreakpointByUrl(id, params, true);
                    this.breakStepType = BreakStepType.NextSticky;
                    return '(()=>{return true})()';
                }
                case RequestMethod.SetBreakpoint: {
                    this.stickyNotSendPaused = true;
                    this.setBreakpoint(id, params, true);
                    this.breakStepType = BreakStepType.NextSticky;
                    return '(()=>{return true})()';
                }
                case RequestMethod.RemoveBreakpoint: {
                    this.stickyNotSendPaused = true;
                    this.removeBreakpoint(id, params);
                    this.breakStepType = BreakStepType.NextSticky;
                    return '(()=>{return true})()';
                }
                case RequestMethod.REPL: {
                    this.stickyNotSendPaused = true;
                    this.breakStepType = BreakStepType.NextSticky;
                    return "(()=>{(()=>{" + params.statement + "})();return true})()";
                }
                case RequestMethod.GetVariableValue: {
                    this.stickyNotSendPaused = true;
                    var params_1 = stickyResponse.params;
                    this.breakStepType = BreakStepType.NextSticky;
                    var variableValueBody = params_1
                        .map(function (v) {
                        return v + ": (() => {try{return " + v + "}catch(e){return undefined}})()";
                    })
                        .join(',');
                    return "(()=>{(()=>{\n          Agent.variableValue({" + variableValueBody + "})\n        })();return true})()";
                }
                case RequestMethod.SetPauseOnExceptions: {
                    this.stickyNotSendPaused = true;
                    this.setPauseOnExceptions(id, params);
                    this.breakStepType = BreakStepType.NextSticky;
                    return '(()=>{return true})()';
                }
                case RequestMethod.SetAsyncCallStackDepth: {
                    this.stickyNotSendPaused = true;
                    this.setAsyncCallStackDepth(id, params);
                    this.breakStepType = BreakStepType.NextSticky;
                    return '(()=>{return true})()';
                }
                case RequestMethod.EvaluateOnCallFrame: {
                    this.stickyNotSendPaused = true;
                    this.evaluateOnCallFrameExpression = params.expression;
                    this.breakStepType = BreakStepType.NextSticky;
                    return "(()=>{\n          let tyroRet,tyroErr;\n          try{tyroRet=eval(Agent.getEvaluateOnCallFrameExpression())}\n          catch(e){tyroErr=e}\n          Agent.evaluateOnCallFrame(" + id + ",tyroRet,tyroErr," + params.generatePreview + ");\n          return true;\n        })()";
                }
                case RequestMethod.GetProperties: {
                    this.stickyNotSendPaused = true;
                    this.getProperties(id, params, true);
                    this.breakStepType = BreakStepType.NextSticky;
                    return '(()=>{return true})()';
                }
                default: {
                    this.breakStepType = BreakStepType.NextSticky;
                    return '(()=>{return true})()';
                }
            }
        };
        StickyFinger.prototype.handleStickyAsync = function (stickyResponse) {
            var id = stickyResponse.id;
            var method = stickyResponse.method;
            var params = stickyResponse.params;
            this.originConsoleAPI.log("[tyro-agent] handleStickyAsync " + id + ", " + method + ", " + params);
            switch (method) {
                case RequestMethod.DiscardConsoleEntries: {
                    this.originConsoleAPI.log("[tyro-agent] DiscardConsoleEntries success");
                    break;
                }
                case RequestMethod.Evaluate: {
                    this.originConsoleAPI.log("[tyro-agent] Evaluate start, expression " + params.expression);
                    var result = this.evaluate(this.globalExecutionContext, id, params);
                    this.originConsoleAPI.log("[tyro-agent] Evaluate success, expression " + params.expression + ", result " + TyroUtil.safeJSONStringify(result));
                    break;
                }
                case RequestMethod.CallFunctionOn: {
                    this.originConsoleAPI.log("[tyro-agent] CallFunctionOn TODO stickyAsync");
                    break;
                }
                case RequestMethod.CompileScript: {
                    this.originConsoleAPI.log("[tyro-agent] CompileScript success, params " + TyroUtil.safeJSONStringify(params));
                    break;
                }
                case RequestMethod.SetBreakpointsActive: {
                    this.breakpointsActive = params.active;
                    this.originConsoleAPI.log("[tyro-agent] SetBreakpointsActive success, breakpointsActive " + this.breakpointsActive);
                    break;
                }
                case RequestMethod.SetSkipAllPauses: {
                    this.skipAllPauses = params.skip;
                    this.originConsoleAPI.log("[tyro-agent] SetSkipAllPauses success, skipAllPauses " + this.skipAllPauses);
                    break;
                }
                case RequestMethod.Pause: {
                    this.breakStepType = BreakStepType.NextSticky;
                    this.originConsoleAPI.log("[tyro-agent] Pause success");
                    break;
                }
                case RequestMethod.GetPossibleBreakpoints: {
                    this.getPossibleBreakpoints(id, params);
                    break;
                }
                case RequestMethod.SetBreakpointByUrl: {
                    this.setBreakpointByUrl(id, params);
                    break;
                }
                case RequestMethod.SetBreakpoint: {
                    this.setBreakpoint(id, params);
                    break;
                }
                case RequestMethod.RemoveBreakpoint: {
                    this.removeBreakpoint(id, params);
                    break;
                }
                case RequestMethod.SetPauseOnExceptions: {
                    this.setPauseOnExceptions(id, params);
                    break;
                }
                case RequestMethod.SetAsyncCallStackDepth: {
                    this.setAsyncCallStackDepth(id, params);
                    break;
                }
                case RequestMethod.GetProperties: {
                    this.getProperties(id, params);
                    break;
                }
            }
        };
        StickyFinger.prototype.objectToRemoteObject = function (object, error, generatePreview) {
            var result = {};
            if (isError(object)) {
                error = object;
            }
            if (error) {
                return error2RemoteObject(error);
            }
            else {
                result.type = typeof object;
                switch (result.type) {
                    case 'undefined':
                        break;
                    case 'object': {
                        if (object === null) {
                            result.subtype = 'null';
                            result.value = null;
                            break;
                        }
                        if (object.constructor !== undefined) {
                            result.className = object.constructor.name;
                        }
                        if (object.toString !== undefined) {
                            try {
                                result.description = object.toString();
                            }
                            catch (e) {
                                result.description = '[object Object]';
                            }
                        }
                        else {
                            result.description = '[object Object]';
                        }
                        this.generateObjectId += 1;
                        result.objectId = String(this.generateObjectId);
                        this.objectMap[String(this.generateObjectId)] = object;
                        if (generatePreview) {
                            result.preview = {
                                type: 'object',
                                description: 'Object',
                                overflow: false,
                                properties: [],
                            };
                            for (var key in object) {
                                var propType = typeof object[key];
                                result.preview.properties.push({
                                    name: key,
                                    type: propType,
                                    value: propType === 'object' ? 'Object' : propType === 'function' ? '' : object[key],
                                });
                            }
                        }
                        break;
                    }
                    case 'function':
                        result.description = object.toString();
                        result.className = 'Function';
                        break;
                    default: {
                        result.value = object;
                        result.description = object.toString();
                    }
                }
            }
            return result;
        };
        StickyFinger.prototype.evaluateOnCallFrame = function (id, returnValue, error, generatePreview) {
            var result = this.objectToRemoteObject(returnValue, error, generatePreview);
            this.xhrSend(ResponseEvent.ById, { result: result }, id, true);
            return result;
        };
        StickyFinger.prototype.evaluate = function (executionContext, id, params) {
            var returnValue, error;
            try {
                returnValue = function (expression) {
                    if (typeof eval === 'function') {
                        return eval(expression);
                    }
                    return Agent.evalReference(expression);
                }.call(executionContext, params.expression);
            }
            catch (e) {
                error = e;
            }
            var result = this.objectToRemoteObject(returnValue, error, params.generatePreview);
            this.xhrSend(ResponseEvent.ById, { result: result }, id);
            return result;
        };
        StickyFinger.prototype.getPossibleBreakpoints = function (id, params, stickyQueue) {
            var scriptId = params.scriptId;
            var startLine = params.startLine;
            var endLine = params.endLine === params.startLine ? params.endLine + 1 : params.endLine;
            var result = {
                locations: [],
            };
            if (this.contextMap[scriptId]) {
                var stickyLine = this.contextMap[scriptId].stickyLine;
                for (var i = startLine; i < endLine; i++) {
                    if (stickyLine.includes(i)) {
                        result.locations.push({
                            scriptId: scriptId,
                            lineNumber: i,
                            columnNumber: 0,
                        });
                    }
                }
            }
            else {
                this.originConsoleAPI.warn("[tyro-agent] getPossibleBreakpoints no scriptId " + scriptId + " in contextMap");
            }
            this.originConsoleAPI.log("[tyro-agent] getPossibleBreakpoints success, result: " + TyroUtil.safeJSONStringify(result));
            this.xhrSend(ResponseEvent.ById, result, id, stickyQueue);
        };
        StickyFinger.prototype.setBreakpointByUrl = function (id, params, stickyQueue) {
            var scriptId = params.scriptId;
            var url = params.url;
            var lineNumber = params.lineNumber;
            if (!this.contextMap[scriptId]) {
                this.originConsoleAPI.warn("[tyro-agent] setBreakpointByUrl no contextMap, scriptId: " + scriptId);
                return;
            }
            var stickyLine = this.contextMap[scriptId].stickyLine;
            if (!stickyLine.includes(lineNumber)) {
                this.originConsoleAPI.warn("[tyro-agent] setBreakpointByUrl not sticky line, scriptId: " + scriptId + ", url: " + url + ", lineNumber: " + lineNumber);
                return;
            }
            var breakpointId = scriptId + ":" + lineNumber + ":0:" + url;
            var result = {
                breakpointId: breakpointId,
                locations: [
                    {
                        scriptId: scriptId,
                        lineNumber: lineNumber,
                        columnNumber: 0,
                    },
                ],
            };
            this.breakpointMap[scriptId][lineNumber] = breakpointId;
            this.breakpointIdMap[breakpointId] = {
                contextId: scriptId,
                line: lineNumber,
            };
            this.originConsoleAPI.log("[tyro-agent] setBreakpointByUrl success, scriptId: " + scriptId + ", url: " + url + ", lineNumber: " + lineNumber);
            this.xhrSend(ResponseEvent.ById, result, id, stickyQueue);
        };
        StickyFinger.prototype.setBreakpoint = function (id, params, stickyQueue) {
            var scriptId = params.scriptId;
            var lineNumber = params.lineNumber;
            if (!this.contextMap[scriptId]) {
                this.originConsoleAPI.warn("[tyro-agent] setBreakpoint no contextMap, scriptId: " + scriptId);
                return;
            }
            var stickyLine = this.contextMap[scriptId].stickyLine;
            if (!stickyLine.includes(lineNumber)) {
                this.originConsoleAPI.warn("[tyro-agent] setBreakpoint not sticky line, scriptId: " + scriptId + ", lineNumber: " + lineNumber);
                return;
            }
            var breakpointId = scriptId + ":" + lineNumber + ":0";
            var result = {
                breakpointId: breakpointId,
                actualLocation: {
                    scriptId: scriptId,
                    lineNumber: lineNumber,
                    columnNumber: 0,
                },
            };
            this.breakpointMap[scriptId][lineNumber] = breakpointId;
            this.breakpointIdMap[breakpointId] = {
                contextId: scriptId,
                line: lineNumber,
            };
            this.originConsoleAPI.log("[tyro-agent] setBreakpoint success, scriptId: " + scriptId + ", lineNumber: " + lineNumber);
            this.xhrSend(ResponseEvent.ById, result, id, stickyQueue);
        };
        StickyFinger.prototype.removeBreakpoint = function (id, params) {
            var breakpointId = params.breakpointId;
            var breakpointDetail = this.breakpointIdMap[breakpointId];
            if (!breakpointDetail) {
                this.originConsoleAPI.warn("[tyro-agent] removeBreakpoint no breakpointId " + breakpointId);
            }
            var scriptId = breakpointDetail.contextId;
            var line = breakpointDetail.line;
            delete this.breakpointMap[scriptId][line];
            this.originConsoleAPI.log("[tyro-agent] removeBreakpoint success, breakpointId: " + breakpointId + ", scriptId: " + scriptId + ", line: " + line);
        };
        StickyFinger.prototype.setPauseOnExceptions = function (id, params) {
            if (!params || !['none', 'uncaught', 'all'].includes(params.state)) {
                this.originConsoleAPI.warn("[tyro-agent] setPauseOnExceptions state invalid: " + TyroUtil.safeJSONStringify(params));
                return;
            }
            this.pauseOnExceptions = params.state;
            this.originConsoleAPI.log("[tyro-agent] setPauseOnExceptions success, pauseOnExceptions state " + this.pauseOnExceptions);
        };
        StickyFinger.prototype.setAsyncCallStackDepth = function (id, params) {
            if (!params || typeof params.maxDepth !== 'number' || params.maxDepth < 0) {
                this.originConsoleAPI.warn("[tyro-agent] setAsyncCallStackDepth maxDepth invalid: " + TyroUtil.safeJSONStringify(params));
                return;
            }
            this.asyncCallStackDepth = params.maxDepth;
            this.originConsoleAPI.log("[tyro-agent] setAsyncCallStackDepth success, maxDepth " + this.asyncCallStackDepth);
        };
        StickyFinger.prototype.getProperties = function (id, params, stickyQueue) {
            var objectId = params.objectId;
            var object = this.objectMap[objectId];
            var result = [];
            for (var key in object) {
                result.push({
                    name: key,
                    value: this.objectToRemoteObject(object[key]),
                });
            }
            this.xhrSend(ResponseEvent.ById, { result: result }, id, stickyQueue);
        };
        StickyFinger.prototype.generateFingerId = function () {
            this.fingerId += 1;
            return this.fingerId;
        };
        return StickyFinger;
    }());
    var Agent = (function () {
        function Agent(instrumentId, rawContextJSON) {
            if (Agent.singleton) {
                return Agent.singleton;
            }
            this.host = "https://" + getServerConfig().domain;
            this.stickyFinger = new StickyFinger(typeof window !== 'undefined' ? window : self, this.host, instrumentId, rawContextJSON);
        }
        Agent.getShadowMethod = function () {
            this.globalReference = self;
            if (typeof eval === 'function') {
                this.evalReference = eval;
            }
            else if (typeof __eval === 'function') {
                this.evalReference = __eval;
            }
        };
        Agent.setShadowMethod = function () {
            this.globalReference.eval = this.evalReference;
        };
        Agent.setInstrumentId = function (instrumentId) {
            this.instrumentId = instrumentId;
        };
        Agent.register = function (rawContextJSON, sourceCode) {
            if (!Agent.singleton) {
                if (!this.instrumentId && typeof my !== 'undefined') {
                    try {
                        this.instrumentId = getStartupParams().tyroId;
                    }
                    catch (error) { }
                }
                Agent.instance(this.instrumentId, rawContextJSON);
            }
            Agent.singleton.stickyFinger.register(rawContextJSON, sourceCode);
        };
        Agent.sticky = function (contextId, line, scopeUid) {
            return Agent.singleton.stickyFinger.sticky(contextId, line, scopeUid);
        };
        Agent.getEvaluateOnCallFrameExpression = function () {
            return Agent.singleton.stickyFinger.evaluateOnCallFrameExpression;
        };
        Agent.evaluateOnCallFrame = function (id, returnValue, error, generatePreview) {
            return Agent.singleton.stickyFinger.evaluateOnCallFrame(id, returnValue, error, generatePreview);
        };
        Agent.getScopeVariables = function () {
            return Agent.singleton.stickyFinger.scopeVariables;
        };
        Agent.inflateStickyParamsObject = function (inflateObject) {
            return Agent.singleton.stickyFinger.inflateStickyParamsObject(inflateObject);
        };
        Agent.entry = function (contextId, scopeUid) {
            return Agent.singleton.stickyFinger.fingerEntry(contextId, scopeUid);
        };
        Agent.exit = function (contextId, scopeUid, fingerId) {
            Agent.singleton.stickyFinger.fingerExit(contextId, scopeUid, fingerId);
        };
        Agent.instance = function (instrumentId, rawContextJSON) {
            Agent.singleton = new Agent(instrumentId, rawContextJSON);
        };
        Agent.isPhone = true;
        Agent.instrumentId = null;
        return Agent;
    }());
    Agent.getShadowMethod();
    var globalReference = typeof window !== 'undefined' ? window : self;
    if (!globalReference.Agent) {
        globalReference.StickyFinger = StickyFinger;
        globalReference.Agent = Agent;
    }

}());

!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=43)}({0:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var originalBridgeCall=self.AlipayJSBridge&&self.AlipayJSBridge.call,originalFetch=self.fetch,originImportScripts=self.importScripts,originEval="function"==typeof self.__eval?self.__eval:self.eval;exports.getUserAgent=function(){return navigator.swuserAgent||navigator.userAgent||""},exports.debug=console.log.bind(console),exports.checkIOS=function(){return/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(exports.getUserAgent())},exports.isLyra=function(){return Boolean(self.__LyraWSWorkerOrigin)},exports.callInternalAPI=function(e,t){var n={data:{method:e,param:t},action:"internalAPI"},o=encodeURIComponent(JSON.stringify(n));originalFetch?originalFetch("https://alipay.kylinBridge/?data="+o,{mode:"no-cors"}).then((function(){})).catch((function(){})):originalBridgeCall&&originalBridgeCall("internalAPI",{method:e,param:t})},exports.getStartupParams=function(){return self.__appxStartupParams&&self.__appxStartupParams.appId?self.__appxStartupParams:self.AFAppX&&self.AFAppX.bridge&&self.AFAppX.bridge.callSync&&self.AFAppX.bridge.callSync("getStartupParams")||{}},exports.getBridge=function(){return self.AFAppX.bridge};var appxImported=!1,appxImportListener=[];exports.runAfterAppx=function(e){if(self.AFAppX)return appxImported=!0,void e();self.importScripts=function(e){originImportScripts(e),!appxImported&&/af-appx\.worker\.min\.js$/.test(e)&&(appxImported=!0,appxImportListener.forEach((function(e){return e()})),appxImportListener=[])},appxImportListener.push(e)},exports.evaluateScript=function(expression){return"function"==typeof eval?eval(expression):"function"==typeof originEval?(self.eval=originEval,eval(expression)):void 0}},10:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(11),r=n(0),s=n(2),a=n(5),i=function(){r.getBridge().call("showRemoteDebugPanel",{status:"connecting",text:"远程调试准备中",buttonTitle:"退出"})},c=function(){r.getBridge().call("showRemoteDebugPanel",{status:"connected",text:"远程调试已连接",buttonTitle:"退出"})},u=function(){r.getBridge().call("showRemoteDebugPanel",{status:"disconnected",text:"远程调试已断开",buttonTitle:"退出"})};t.SocketConn={messageQueue:[],socketTask:null,send:function(e){var t=this,n="string"==typeof e?e:JSON.stringify(e);n.length>5242880?r.debug("[bugme] socket send failed, size: ",n.length):this.socketTask?(this.messageQueue.length&&(this.messageQueue.forEach((function(e){t.socketTask.send({data:e})})),this.messageQueue=[]),this.socketTask.send({data:n})):this.messageQueue.push(n)},close:function(){this.socketTask?this.socketTask.close():r.getBridge().showToast({content:"请点击右上角关闭按钮退出",duration:1e3})},connect:function(e){var t=this,n=r.getBridge(),o=n.connectSocket({url:e,multiple:!0}),s=function(){t.socketTask||(t.socketTask=o,t.onopen(),r.debug("[bugme] websocket connected"))};o.onOpen((function(){s()})),o.onMessage((function(e){t.socketTask||s(),t.onmessage(e)})),o.onClose((function(){t.onclose()})),o.onError((function(){t.socketTask||(u(),n.showToast({content:"本次真机调试已结束，请重新生成调试版本",duration:2e3}))}))},open:function(){var e=this,t=r.getStartupParams(),n=t.channelId,o=t.channelAuthPair,s=t.remoteCh,c=self.__LyraWSWorkerOrigin;if(n||c){i();var u=a.wssConfig.default.openchannel;s&&a.wssConfig[s]&&a.wssConfig[s].openchannel&&(u=a.wssConfig[s].openchannel);var l=r.getBridge(),p=c?c+"/worker":"wss://"+u+"/group/connect/"+n+"?scene=tinyAppDebug&roleType=TINYAPP&roleId=0";if(o&&(p+="?"+o.key+"="+o.value),r.checkIOS()&&!r.isLyra()){this.connect(p);var f=l.connectSocket;l.connectSocket=function(e){if(e&&e.multiple)return f(e);l.showToast({content:"iOS 真机调试暂不支持 connectSocket JSAPI",duration:1e3})},l.onSocketOpen=l.offSocketOpen=l.onSocketMessage=l.offSocketMessage=l.closeSocket=function(){}}else setTimeout((function(){e.connect(p)}),1200)}else r.debug("[bugme] missing channelId in startup params")},onopen:function(){var e=r.getBridge(),t=e.getSystemInfoSync();this.send({method:s.RemoteXMethods.Connect,params:{userAgent:r.getUserAgent(),sdkVersion:e.SDKVersion,alipayVersion:t.version,model:t.model,system:t.system}}),c()},onmessage:function(e){try{var t=JSON.parse(e.data.data),n=t.method,a=t.id,i=t.params;if(n===s.RemoteXMethods.Disconnect)this.close();else if(n===s.RemoteXMethods.EvaluteScript){if(i&&i.code)try{var c=r.evaluateScript(i.code);this.send({returnId:a,payload:o.stringify(c)})}catch(e){r.debug("[remoteX worker evaluateScript] ",e)}}else n===s.RemoteXMethods.Ping&&this.send({method:s.RemoteXMethods.Pong,params:{returnId:a}})}catch(t){r.debug("RemoteX onSocketMessage error",t,e)}},onclose:function(){this.socketTask=null,this.messageQueue=[],u(),[1,2].forEach((function(e){r.getBridge().call("closeSocket",{socketTaskId:e})}))}}},11:function(e,t){var n="\\x"+("0"+"~".charCodeAt(0).toString(16)).slice(-2),o="\\"+n,r=new RegExp(n,"g"),s=new RegExp(o,"g"),a=new RegExp("(?:^|([^\\\\]))"+o),i=[].indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},c=String;function u(e,t,n){return t instanceof Array?function(e,t,n){for(var o=0,r=t.length;o<r;o++)t[o]=u(e,t[o],n);return t}(e,t,n):t instanceof c?t.length?n.hasOwnProperty(t)?n[t]:n[t]=function(e,t){for(var n=0,o=t.length;n<o;e=e[t[n++].replace(s,"~")]);return e}(e,t.split("~")):e:t instanceof Object?function(e,t,n){for(var o in t)t.hasOwnProperty(o)&&(t[o]=u(e,t[o],n));return t}(e,t,n):t}var l={stringify:function(e,t,s,a){return l.parser.stringify(e,function(e,t,s){var a,c,u=!1,l=!!t,p=[],f=[e],d=[e],g=[s?"~":"[Circular]"],m=e,h=1;return l&&(c="object"==typeof t?function(e,n){return""!==e&&t.indexOf(e)<0?void 0:n}:t),function(e,t){return l&&(t=c.call(this,e,t)),u?(m!==this&&(a=h-i.call(f,this)-1,h-=a,f.splice(h,f.length),p.splice(h-1,p.length),m=this),"object"==typeof t&&t?(i.call(f,t)<0&&f.push(m=t),h=f.length,(a=i.call(d,t))<0?(a=d.push(t)-1,s?(p.push((""+e).replace(r,n)),g[a]="~"+p.join("~")):g[a]=g[0]):t=g[a]):"string"==typeof t&&s&&(t=t.replace(n,o).replace("~",n))):u=!0,t}}(e,t,!a),s)},parse:function(e,t){return l.parser.parse(e,function(e){return function(t,r){var s="string"==typeof r;return s&&"~"===r.charAt(0)?new c(r.slice(1)):(""===t&&(r=u(r,r,{})),s&&(r=r.replace(a,"$1~").replace(o,n)),e?e.call(this,t,r):r)}}(t))},parser:JSON};e.exports=l},2:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){e.Connect="RemoteX.connect",e.Disconnect="RemoteX.disconnect",e.PageChanged="RemoteX.pageChanged",e.DataChanged="RemoteX.dataChanged",e.EvaluteScript="RemoteX.evaluteScript",e.syncStorage="RemoteX.syncStorage",e.requestWillBeSent="RemoteX.requestWillBeSent",e.requestFinished="RemoteX.requestFinished",e.Ping="RemoteX.ping",e.Pong="RemoteX.pong"}(t.RemoteXMethods||(t.RemoteXMethods={}))},43:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(44),r=n(47),s=n(0);s.runAfterAppx((function(){setTimeout((function(){s.debug("[bugme] run after appx"),s.getStartupParams().isRemoteX||s.isLyra()?(s.debug("[bugme] remotex mode"),o.registerRemoteX()):(s.debug("[bugme] preview mode"),r.registerPreview())}),1e3)}))},44:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(10),r=n(0),s=n(45);t.registerRemoteX=function(){if(self.navigator){r.debug("[bugme] start to register remotex"),s.listenEvents(),o.SocketConn.open(),self.bugmeAPI={send:function(e){o.SocketConn.send(e)}};if(self.document&&self.document.dispatchEvent)try{self.document.dispatchEvent("bugmeInjected")}catch(e){self.document.dispatchEvent(new CustomEvent("bugmeInjected"))}else self.dispatchEvent&&self.dispatchEvent(new CustomEvent("bugmeInjected"))}}},45:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(2),r=n(0),s=n(10),a=n(46);function i(e){if(!e||"object"!=typeof e)return{};var t={};return Object.keys(e).forEach((function(n){t[n]=""+e[n]})),t}var c=/^https?:\/\/hpmweb\.alipay\.com/,u=function(e){c.test(e.url)||s.SocketConn.send({method:o.RemoteXMethods.requestWillBeSent,params:{reqId:e.requestId,url:e.url,method:(e.method||"GET").toUpperCase(),body:e.postBody,headers:i(e.headers)}})},l=function(e){c.test(e.url)||s.SocketConn.send({method:o.RemoteXMethods.requestFinished,params:{reqId:e.requestId,url:e.url,status:e.status,body:e.body,headers:i(e.headers)}})},p=function(e){c.test(e.url)||s.SocketConn.send({method:o.RemoteXMethods.requestFinished,params:{reqId:e.requestId,url:e.url,status:null}})},f=function(e){var t={};Object.keys(e.data).forEach((function(n){try{t[n]=JSON.parse(e.data[n]).APDataStorage}catch(e){}})),s.SocketConn.send({method:o.RemoteXMethods.syncStorage,params:{data:t}})};t.listenEvents=function(){var e=r.getBridge();e.on(a.ERiverWorkerEvent.PageResume,(function(){s.SocketConn.send({method:o.RemoteXMethods.PageChanged})})),e.on(a.ERiverWorkerEvent.DebugPanelClick,(function(){s.SocketConn.close()})),r.checkIOS()&&!r.isLyra()?(e.on(a.ERiverDebugEvent.networkRequest,(function(e){var t=e.data;u(t)})),e.on(a.ERiverDebugEvent.networkResponse,(function(e){var t=e.data;l(t)})),e.on(a.ERiverDebugEvent.networkError,(function(e){var t=e.data;p(t)})),e.on(a.ERiverDebugEvent.storageChanged,(function(e){var t=e.data;f(t)}))):e.on(a.ERiverDebugEvent.debugConsole,(function(e){var t,n=e.data,o=n.type,r=n.content;try{t=JSON.parse(r)}catch(e){return}switch(o){case a.ERiverDebugEvent.networkRequest:u(t);break;case a.ERiverDebugEvent.networkResponse:l(t);break;case a.ERiverDebugEvent.networkError:p(t);break;case a.ERiverDebugEvent.storageChanged:f(t)}}))}},46:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){e.networkRequest="tinyAppRemoteDebug_network_request",e.networkResponse="tinyAppRemoteDebug_network_response",e.networkError="tinyAppRemoteDebug_network_error",e.storageChanged="tinyAppRemoteDebug_storage",e.debugConsole="onTinyDebugConsole",e.vconsoleMessage="onMessageFromVConsole"}(t.ERiverDebugEvent||(t.ERiverDebugEvent={})),function(e){e.PageResume="pageResume",e.DebugPanelClick="tinyRemoteDebugPanelButtonClick"}(t.ERiverWorkerEvent||(t.ERiverWorkerEvent={}))},47:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(11),r=n(0),s=function(e,t){return void 0===t?"©undefined":null===t?"©null":t===-1/0?"©- Infinity":t===1/0?"©Infinity":"number"==typeof t&&isNaN(t)?"©NaN":"function"==typeof t?"©function":t},a=Function,i=function(e){try{if(e.fromVConsoleToWorker){var t=e.requestId;if("exec"===e.method){try{new a("requestId","sendBack","var res = "+e.script+";console.log(res);")(t,(function(e){return r.callInternalAPI("tinyDebugConsole",{type:"msgFromWorkerToVConsole",content:o.stringify({requestId:t,returnValue:e},s)})}))}catch(e){console.error(e.name+":"+e.message)}}}}catch(e){}};t.registerPreview=function(){setTimeout((function(){self.document?self.document.addEventListener("push",(function(e){try{var t=e.data.param;i(JSON.parse(t.content||t.data.content))}catch(e){}})):self.addEventListener&&self.addEventListener("push",(function(e){try{var t=JSON.parse(JSON.parse(e.data.text()).param.data.content);i(t)}catch(e){}}))}),10),["log","info","error","debug","warn"].forEach((function(e){var t="o"+e;console[t]||(console[t]=console[e],console[e]=function(){for(var n,a=[],i=0;i<arguments.length;i++)a[i]=arguments[i];console[t].apply(console,a);try{n=o.stringify(a.map((function(e){return e instanceof Error?e.name+": "+e.message:e})),s)}catch(e){return void console.error(e.name+": "+e.message)}r.callInternalAPI("tinyDebugConsole",{content:n,type:"console_"+e})})}))}},5:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.wssConfig={default:{openchannel:"openchannel.alipay.com",hpmweb:"hpmweb.alipay.com"},1:{openchannel:"miniprogram.alipay.com",hpmweb:"hpmweb.alipay.com"}}}});
if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');
require('./importScripts$');

var AFAppX = self.AFAppX;
self.getCurrentPages = AFAppX.getCurrentPages;
self.getApp = AFAppX.getApp;
self.Page = AFAppX.Page;
self.App = AFAppX.App;
self.my = AFAppX.bridge || AFAppX.abridge;
self.abridge = self.my;
self.Component = AFAppX.WorkerComponent || function(){};
self.$global = AFAppX.$global;
self.requirePlugin = AFAppX.requirePlugin;


if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../node_modules/mini-ali-ui/es/am-icon/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/input-item/index?hash=5a0c180d5ccf7c9d483dd4817cdab5489824013c');
require('../../pages/components/block-list/block-list?hash=ed5679146f4e803b45f9c8a5fec2ceccc7cd10d5');
require('../../pages/components/header/header?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/components/modal/modal?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/index/index?hash=4787ddb4bb28715ae7d8cc6f6f1cd95e75a04dba');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}