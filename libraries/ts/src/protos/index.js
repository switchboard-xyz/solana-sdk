/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots.sbv2Protos || ($protobuf.roots.sbv2Protos = {});
    
    $root.OracleJob = (function() {
    
        /**
         * Properties of an OracleJob.
         * @exports IOracleJob
         * @interface IOracleJob
         * @property {Array.<OracleJob.ITask>|null} [tasks] OracleJob tasks
         */
    
        /**
         * Constructs a new OracleJob.
         * @exports OracleJob
         * @classdesc Represents an OracleJob.
         * @implements IOracleJob
         * @constructor
         * @param {IOracleJob=} [properties] Properties to set
         */
        function OracleJob(properties) {
            this.tasks = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * OracleJob tasks.
         * @member {Array.<OracleJob.ITask>} tasks
         * @memberof OracleJob
         * @instance
         */
        OracleJob.prototype.tasks = $util.emptyArray;
    
        /**
         * Creates a new OracleJob instance using the specified properties.
         * @function create
         * @memberof OracleJob
         * @static
         * @param {IOracleJob=} [properties] Properties to set
         * @returns {OracleJob} OracleJob instance
         */
        OracleJob.create = function create(properties) {
            return new OracleJob(properties);
        };
    
        /**
         * Encodes the specified OracleJob message. Does not implicitly {@link OracleJob.verify|verify} messages.
         * @function encode
         * @memberof OracleJob
         * @static
         * @param {IOracleJob} message OracleJob message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OracleJob.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.tasks != null && message.tasks.length)
                for (var i = 0; i < message.tasks.length; ++i)
                    $root.OracleJob.Task.encode(message.tasks[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified OracleJob message, length delimited. Does not implicitly {@link OracleJob.verify|verify} messages.
         * @function encodeDelimited
         * @memberof OracleJob
         * @static
         * @param {IOracleJob} message OracleJob message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OracleJob.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an OracleJob message from the specified reader or buffer.
         * @function decode
         * @memberof OracleJob
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {OracleJob} OracleJob
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OracleJob.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.tasks && message.tasks.length))
                        message.tasks = [];
                    message.tasks.push($root.OracleJob.Task.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an OracleJob message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof OracleJob
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {OracleJob} OracleJob
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OracleJob.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an OracleJob message.
         * @function verify
         * @memberof OracleJob
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OracleJob.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.tasks != null && message.hasOwnProperty("tasks")) {
                if (!Array.isArray(message.tasks))
                    return "tasks: array expected";
                for (var i = 0; i < message.tasks.length; ++i) {
                    var error = $root.OracleJob.Task.verify(message.tasks[i]);
                    if (error)
                        return "tasks." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates an OracleJob message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof OracleJob
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {OracleJob} OracleJob
         */
        OracleJob.fromObject = function fromObject(object) {
            if (object instanceof $root.OracleJob)
                return object;
            var message = new $root.OracleJob();
            if (object.tasks) {
                if (!Array.isArray(object.tasks))
                    throw TypeError(".OracleJob.tasks: array expected");
                message.tasks = [];
                for (var i = 0; i < object.tasks.length; ++i) {
                    if (typeof object.tasks[i] !== "object")
                        throw TypeError(".OracleJob.tasks: object expected");
                    message.tasks[i] = $root.OracleJob.Task.fromObject(object.tasks[i]);
                }
            }
            return message;
        };
    
        /**
         * Creates a plain object from an OracleJob message. Also converts values to other types if specified.
         * @function toObject
         * @memberof OracleJob
         * @static
         * @param {OracleJob} message OracleJob
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OracleJob.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.tasks = [];
            if (message.tasks && message.tasks.length) {
                object.tasks = [];
                for (var j = 0; j < message.tasks.length; ++j)
                    object.tasks[j] = $root.OracleJob.Task.toObject(message.tasks[j], options);
            }
            return object;
        };
    
        /**
         * Converts this OracleJob to JSON.
         * @function toJSON
         * @memberof OracleJob
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OracleJob.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        OracleJob.HttpTask = (function() {
    
            /**
             * Properties of a HttpTask.
             * @memberof OracleJob
             * @interface IHttpTask
             * @property {string|null} [url] HttpTask url
             * @property {OracleJob.HttpTask.Method|null} [method] HttpTask method
             * @property {Array.<OracleJob.HttpTask.IHeader>|null} [headers] HttpTask headers
             * @property {string|null} [body] HttpTask body
             */
    
            /**
             * Constructs a new HttpTask.
             * @memberof OracleJob
             * @classdesc Represents a HttpTask.
             * @implements IHttpTask
             * @constructor
             * @param {OracleJob.IHttpTask=} [properties] Properties to set
             */
            function HttpTask(properties) {
                this.headers = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * HttpTask url.
             * @member {string} url
             * @memberof OracleJob.HttpTask
             * @instance
             */
            HttpTask.prototype.url = "";
    
            /**
             * HttpTask method.
             * @member {OracleJob.HttpTask.Method} method
             * @memberof OracleJob.HttpTask
             * @instance
             */
            HttpTask.prototype.method = 0;
    
            /**
             * HttpTask headers.
             * @member {Array.<OracleJob.HttpTask.IHeader>} headers
             * @memberof OracleJob.HttpTask
             * @instance
             */
            HttpTask.prototype.headers = $util.emptyArray;
    
            /**
             * HttpTask body.
             * @member {string} body
             * @memberof OracleJob.HttpTask
             * @instance
             */
            HttpTask.prototype.body = "";
    
            /**
             * Creates a new HttpTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.HttpTask
             * @static
             * @param {OracleJob.IHttpTask=} [properties] Properties to set
             * @returns {OracleJob.HttpTask} HttpTask instance
             */
            HttpTask.create = function create(properties) {
                return new HttpTask(properties);
            };
    
            /**
             * Encodes the specified HttpTask message. Does not implicitly {@link OracleJob.HttpTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.HttpTask
             * @static
             * @param {OracleJob.IHttpTask} message HttpTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HttpTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
                if (message.method != null && Object.hasOwnProperty.call(message, "method"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.method);
                if (message.headers != null && message.headers.length)
                    for (var i = 0; i < message.headers.length; ++i)
                        $root.OracleJob.HttpTask.Header.encode(message.headers[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.body != null && Object.hasOwnProperty.call(message, "body"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.body);
                return writer;
            };
    
            /**
             * Encodes the specified HttpTask message, length delimited. Does not implicitly {@link OracleJob.HttpTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.HttpTask
             * @static
             * @param {OracleJob.IHttpTask} message HttpTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HttpTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a HttpTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.HttpTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.HttpTask} HttpTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HttpTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.HttpTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.url = reader.string();
                        break;
                    case 2:
                        message.method = reader.int32();
                        break;
                    case 3:
                        if (!(message.headers && message.headers.length))
                            message.headers = [];
                        message.headers.push($root.OracleJob.HttpTask.Header.decode(reader, reader.uint32()));
                        break;
                    case 4:
                        message.body = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a HttpTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.HttpTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.HttpTask} HttpTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HttpTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a HttpTask message.
             * @function verify
             * @memberof OracleJob.HttpTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            HttpTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.url != null && message.hasOwnProperty("url"))
                    if (!$util.isString(message.url))
                        return "url: string expected";
                if (message.method != null && message.hasOwnProperty("method"))
                    switch (message.method) {
                    default:
                        return "method: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                if (message.headers != null && message.hasOwnProperty("headers")) {
                    if (!Array.isArray(message.headers))
                        return "headers: array expected";
                    for (var i = 0; i < message.headers.length; ++i) {
                        var error = $root.OracleJob.HttpTask.Header.verify(message.headers[i]);
                        if (error)
                            return "headers." + error;
                    }
                }
                if (message.body != null && message.hasOwnProperty("body"))
                    if (!$util.isString(message.body))
                        return "body: string expected";
                return null;
            };
    
            /**
             * Creates a HttpTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.HttpTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.HttpTask} HttpTask
             */
            HttpTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.HttpTask)
                    return object;
                var message = new $root.OracleJob.HttpTask();
                if (object.url != null)
                    message.url = String(object.url);
                switch (object.method) {
                case "METHOD_UNKOWN":
                case 0:
                    message.method = 0;
                    break;
                case "METHOD_GET":
                case 1:
                    message.method = 1;
                    break;
                case "METHOD_POST":
                case 2:
                    message.method = 2;
                    break;
                }
                if (object.headers) {
                    if (!Array.isArray(object.headers))
                        throw TypeError(".OracleJob.HttpTask.headers: array expected");
                    message.headers = [];
                    for (var i = 0; i < object.headers.length; ++i) {
                        if (typeof object.headers[i] !== "object")
                            throw TypeError(".OracleJob.HttpTask.headers: object expected");
                        message.headers[i] = $root.OracleJob.HttpTask.Header.fromObject(object.headers[i]);
                    }
                }
                if (object.body != null)
                    message.body = String(object.body);
                return message;
            };
    
            /**
             * Creates a plain object from a HttpTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.HttpTask
             * @static
             * @param {OracleJob.HttpTask} message HttpTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            HttpTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.headers = [];
                if (options.defaults) {
                    object.url = "";
                    object.method = options.enums === String ? "METHOD_UNKOWN" : 0;
                    object.body = "";
                }
                if (message.url != null && message.hasOwnProperty("url"))
                    object.url = message.url;
                if (message.method != null && message.hasOwnProperty("method"))
                    object.method = options.enums === String ? $root.OracleJob.HttpTask.Method[message.method] : message.method;
                if (message.headers && message.headers.length) {
                    object.headers = [];
                    for (var j = 0; j < message.headers.length; ++j)
                        object.headers[j] = $root.OracleJob.HttpTask.Header.toObject(message.headers[j], options);
                }
                if (message.body != null && message.hasOwnProperty("body"))
                    object.body = message.body;
                return object;
            };
    
            /**
             * Converts this HttpTask to JSON.
             * @function toJSON
             * @memberof OracleJob.HttpTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            HttpTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            /**
             * Method enum.
             * @name OracleJob.HttpTask.Method
             * @enum {number}
             * @property {number} METHOD_UNKOWN=0 METHOD_UNKOWN value
             * @property {number} METHOD_GET=1 METHOD_GET value
             * @property {number} METHOD_POST=2 METHOD_POST value
             */
            HttpTask.Method = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "METHOD_UNKOWN"] = 0;
                values[valuesById[1] = "METHOD_GET"] = 1;
                values[valuesById[2] = "METHOD_POST"] = 2;
                return values;
            })();
    
            HttpTask.Header = (function() {
    
                /**
                 * Properties of a Header.
                 * @memberof OracleJob.HttpTask
                 * @interface IHeader
                 * @property {string|null} [key] Header key
                 * @property {string|null} [value] Header value
                 */
    
                /**
                 * Constructs a new Header.
                 * @memberof OracleJob.HttpTask
                 * @classdesc Represents a Header.
                 * @implements IHeader
                 * @constructor
                 * @param {OracleJob.HttpTask.IHeader=} [properties] Properties to set
                 */
                function Header(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Header key.
                 * @member {string} key
                 * @memberof OracleJob.HttpTask.Header
                 * @instance
                 */
                Header.prototype.key = "";
    
                /**
                 * Header value.
                 * @member {string} value
                 * @memberof OracleJob.HttpTask.Header
                 * @instance
                 */
                Header.prototype.value = "";
    
                /**
                 * Creates a new Header instance using the specified properties.
                 * @function create
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {OracleJob.HttpTask.IHeader=} [properties] Properties to set
                 * @returns {OracleJob.HttpTask.Header} Header instance
                 */
                Header.create = function create(properties) {
                    return new Header(properties);
                };
    
                /**
                 * Encodes the specified Header message. Does not implicitly {@link OracleJob.HttpTask.Header.verify|verify} messages.
                 * @function encode
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {OracleJob.HttpTask.IHeader} message Header message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Header.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
                    return writer;
                };
    
                /**
                 * Encodes the specified Header message, length delimited. Does not implicitly {@link OracleJob.HttpTask.Header.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {OracleJob.HttpTask.IHeader} message Header message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Header.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Header message from the specified reader or buffer.
                 * @function decode
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {OracleJob.HttpTask.Header} Header
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Header.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.HttpTask.Header();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.key = reader.string();
                            break;
                        case 2:
                            message.value = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Header message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {OracleJob.HttpTask.Header} Header
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Header.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Header message.
                 * @function verify
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Header.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.key != null && message.hasOwnProperty("key"))
                        if (!$util.isString(message.key))
                            return "key: string expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (!$util.isString(message.value))
                            return "value: string expected";
                    return null;
                };
    
                /**
                 * Creates a Header message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {OracleJob.HttpTask.Header} Header
                 */
                Header.fromObject = function fromObject(object) {
                    if (object instanceof $root.OracleJob.HttpTask.Header)
                        return object;
                    var message = new $root.OracleJob.HttpTask.Header();
                    if (object.key != null)
                        message.key = String(object.key);
                    if (object.value != null)
                        message.value = String(object.value);
                    return message;
                };
    
                /**
                 * Creates a plain object from a Header message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {OracleJob.HttpTask.Header} message Header
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Header.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.key = "";
                        object.value = "";
                    }
                    if (message.key != null && message.hasOwnProperty("key"))
                        object.key = message.key;
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = message.value;
                    return object;
                };
    
                /**
                 * Converts this Header to JSON.
                 * @function toJSON
                 * @memberof OracleJob.HttpTask.Header
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Header.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Header;
            })();
    
            return HttpTask;
        })();
    
        OracleJob.JsonParseTask = (function() {
    
            /**
             * Properties of a JsonParseTask.
             * @memberof OracleJob
             * @interface IJsonParseTask
             * @property {string|null} [path] JsonParseTask path
             * @property {OracleJob.JsonParseTask.AggregationMethod|null} [aggregationMethod] JsonParseTask aggregationMethod
             */
    
            /**
             * Constructs a new JsonParseTask.
             * @memberof OracleJob
             * @classdesc Represents a JsonParseTask.
             * @implements IJsonParseTask
             * @constructor
             * @param {OracleJob.IJsonParseTask=} [properties] Properties to set
             */
            function JsonParseTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * JsonParseTask path.
             * @member {string} path
             * @memberof OracleJob.JsonParseTask
             * @instance
             */
            JsonParseTask.prototype.path = "";
    
            /**
             * JsonParseTask aggregationMethod.
             * @member {OracleJob.JsonParseTask.AggregationMethod} aggregationMethod
             * @memberof OracleJob.JsonParseTask
             * @instance
             */
            JsonParseTask.prototype.aggregationMethod = 0;
    
            /**
             * Creates a new JsonParseTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {OracleJob.IJsonParseTask=} [properties] Properties to set
             * @returns {OracleJob.JsonParseTask} JsonParseTask instance
             */
            JsonParseTask.create = function create(properties) {
                return new JsonParseTask(properties);
            };
    
            /**
             * Encodes the specified JsonParseTask message. Does not implicitly {@link OracleJob.JsonParseTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {OracleJob.IJsonParseTask} message JsonParseTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            JsonParseTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.path != null && Object.hasOwnProperty.call(message, "path"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.path);
                if (message.aggregationMethod != null && Object.hasOwnProperty.call(message, "aggregationMethod"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.aggregationMethod);
                return writer;
            };
    
            /**
             * Encodes the specified JsonParseTask message, length delimited. Does not implicitly {@link OracleJob.JsonParseTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {OracleJob.IJsonParseTask} message JsonParseTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            JsonParseTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a JsonParseTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.JsonParseTask} JsonParseTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            JsonParseTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.JsonParseTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.path = reader.string();
                        break;
                    case 2:
                        message.aggregationMethod = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a JsonParseTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.JsonParseTask} JsonParseTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            JsonParseTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a JsonParseTask message.
             * @function verify
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            JsonParseTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.path != null && message.hasOwnProperty("path"))
                    if (!$util.isString(message.path))
                        return "path: string expected";
                if (message.aggregationMethod != null && message.hasOwnProperty("aggregationMethod"))
                    switch (message.aggregationMethod) {
                    default:
                        return "aggregationMethod: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        break;
                    }
                return null;
            };
    
            /**
             * Creates a JsonParseTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.JsonParseTask} JsonParseTask
             */
            JsonParseTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.JsonParseTask)
                    return object;
                var message = new $root.OracleJob.JsonParseTask();
                if (object.path != null)
                    message.path = String(object.path);
                switch (object.aggregationMethod) {
                case "NONE":
                case 0:
                    message.aggregationMethod = 0;
                    break;
                case "MIN":
                case 1:
                    message.aggregationMethod = 1;
                    break;
                case "MAX":
                case 2:
                    message.aggregationMethod = 2;
                    break;
                case "SUM":
                case 3:
                    message.aggregationMethod = 3;
                    break;
                case "MEAN":
                case 4:
                    message.aggregationMethod = 4;
                    break;
                case "MEDIAN":
                case 5:
                    message.aggregationMethod = 5;
                    break;
                }
                return message;
            };
    
            /**
             * Creates a plain object from a JsonParseTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {OracleJob.JsonParseTask} message JsonParseTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            JsonParseTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.path = "";
                    object.aggregationMethod = options.enums === String ? "NONE" : 0;
                }
                if (message.path != null && message.hasOwnProperty("path"))
                    object.path = message.path;
                if (message.aggregationMethod != null && message.hasOwnProperty("aggregationMethod"))
                    object.aggregationMethod = options.enums === String ? $root.OracleJob.JsonParseTask.AggregationMethod[message.aggregationMethod] : message.aggregationMethod;
                return object;
            };
    
            /**
             * Converts this JsonParseTask to JSON.
             * @function toJSON
             * @memberof OracleJob.JsonParseTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            JsonParseTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            /**
             * AggregationMethod enum.
             * @name OracleJob.JsonParseTask.AggregationMethod
             * @enum {number}
             * @property {number} NONE=0 NONE value
             * @property {number} MIN=1 MIN value
             * @property {number} MAX=2 MAX value
             * @property {number} SUM=3 SUM value
             * @property {number} MEAN=4 MEAN value
             * @property {number} MEDIAN=5 MEDIAN value
             */
            JsonParseTask.AggregationMethod = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "NONE"] = 0;
                values[valuesById[1] = "MIN"] = 1;
                values[valuesById[2] = "MAX"] = 2;
                values[valuesById[3] = "SUM"] = 3;
                values[valuesById[4] = "MEAN"] = 4;
                values[valuesById[5] = "MEDIAN"] = 5;
                return values;
            })();
    
            return JsonParseTask;
        })();
    
        OracleJob.MedianTask = (function() {
    
            /**
             * Properties of a MedianTask.
             * @memberof OracleJob
             * @interface IMedianTask
             * @property {Array.<OracleJob.ITask>|null} [tasks] MedianTask tasks
             * @property {Array.<IOracleJob>|null} [jobs] MedianTask jobs
             * @property {number|null} [minSuccessfulRequired] MedianTask minSuccessfulRequired
             */
    
            /**
             * Constructs a new MedianTask.
             * @memberof OracleJob
             * @classdesc Represents a MedianTask.
             * @implements IMedianTask
             * @constructor
             * @param {OracleJob.IMedianTask=} [properties] Properties to set
             */
            function MedianTask(properties) {
                this.tasks = [];
                this.jobs = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * MedianTask tasks.
             * @member {Array.<OracleJob.ITask>} tasks
             * @memberof OracleJob.MedianTask
             * @instance
             */
            MedianTask.prototype.tasks = $util.emptyArray;
    
            /**
             * MedianTask jobs.
             * @member {Array.<IOracleJob>} jobs
             * @memberof OracleJob.MedianTask
             * @instance
             */
            MedianTask.prototype.jobs = $util.emptyArray;
    
            /**
             * MedianTask minSuccessfulRequired.
             * @member {number} minSuccessfulRequired
             * @memberof OracleJob.MedianTask
             * @instance
             */
            MedianTask.prototype.minSuccessfulRequired = 0;
    
            /**
             * Creates a new MedianTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.MedianTask
             * @static
             * @param {OracleJob.IMedianTask=} [properties] Properties to set
             * @returns {OracleJob.MedianTask} MedianTask instance
             */
            MedianTask.create = function create(properties) {
                return new MedianTask(properties);
            };
    
            /**
             * Encodes the specified MedianTask message. Does not implicitly {@link OracleJob.MedianTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.MedianTask
             * @static
             * @param {OracleJob.IMedianTask} message MedianTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MedianTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.tasks != null && message.tasks.length)
                    for (var i = 0; i < message.tasks.length; ++i)
                        $root.OracleJob.Task.encode(message.tasks[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.jobs != null && message.jobs.length)
                    for (var i = 0; i < message.jobs.length; ++i)
                        $root.OracleJob.encode(message.jobs[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.minSuccessfulRequired != null && Object.hasOwnProperty.call(message, "minSuccessfulRequired"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.minSuccessfulRequired);
                return writer;
            };
    
            /**
             * Encodes the specified MedianTask message, length delimited. Does not implicitly {@link OracleJob.MedianTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.MedianTask
             * @static
             * @param {OracleJob.IMedianTask} message MedianTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MedianTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a MedianTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.MedianTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.MedianTask} MedianTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MedianTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.MedianTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.tasks && message.tasks.length))
                            message.tasks = [];
                        message.tasks.push($root.OracleJob.Task.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        if (!(message.jobs && message.jobs.length))
                            message.jobs = [];
                        message.jobs.push($root.OracleJob.decode(reader, reader.uint32()));
                        break;
                    case 3:
                        message.minSuccessfulRequired = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a MedianTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.MedianTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.MedianTask} MedianTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MedianTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a MedianTask message.
             * @function verify
             * @memberof OracleJob.MedianTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MedianTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.tasks != null && message.hasOwnProperty("tasks")) {
                    if (!Array.isArray(message.tasks))
                        return "tasks: array expected";
                    for (var i = 0; i < message.tasks.length; ++i) {
                        var error = $root.OracleJob.Task.verify(message.tasks[i]);
                        if (error)
                            return "tasks." + error;
                    }
                }
                if (message.jobs != null && message.hasOwnProperty("jobs")) {
                    if (!Array.isArray(message.jobs))
                        return "jobs: array expected";
                    for (var i = 0; i < message.jobs.length; ++i) {
                        var error = $root.OracleJob.verify(message.jobs[i]);
                        if (error)
                            return "jobs." + error;
                    }
                }
                if (message.minSuccessfulRequired != null && message.hasOwnProperty("minSuccessfulRequired"))
                    if (!$util.isInteger(message.minSuccessfulRequired))
                        return "minSuccessfulRequired: integer expected";
                return null;
            };
    
            /**
             * Creates a MedianTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.MedianTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.MedianTask} MedianTask
             */
            MedianTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.MedianTask)
                    return object;
                var message = new $root.OracleJob.MedianTask();
                if (object.tasks) {
                    if (!Array.isArray(object.tasks))
                        throw TypeError(".OracleJob.MedianTask.tasks: array expected");
                    message.tasks = [];
                    for (var i = 0; i < object.tasks.length; ++i) {
                        if (typeof object.tasks[i] !== "object")
                            throw TypeError(".OracleJob.MedianTask.tasks: object expected");
                        message.tasks[i] = $root.OracleJob.Task.fromObject(object.tasks[i]);
                    }
                }
                if (object.jobs) {
                    if (!Array.isArray(object.jobs))
                        throw TypeError(".OracleJob.MedianTask.jobs: array expected");
                    message.jobs = [];
                    for (var i = 0; i < object.jobs.length; ++i) {
                        if (typeof object.jobs[i] !== "object")
                            throw TypeError(".OracleJob.MedianTask.jobs: object expected");
                        message.jobs[i] = $root.OracleJob.fromObject(object.jobs[i]);
                    }
                }
                if (object.minSuccessfulRequired != null)
                    message.minSuccessfulRequired = object.minSuccessfulRequired | 0;
                return message;
            };
    
            /**
             * Creates a plain object from a MedianTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.MedianTask
             * @static
             * @param {OracleJob.MedianTask} message MedianTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MedianTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.tasks = [];
                    object.jobs = [];
                }
                if (options.defaults)
                    object.minSuccessfulRequired = 0;
                if (message.tasks && message.tasks.length) {
                    object.tasks = [];
                    for (var j = 0; j < message.tasks.length; ++j)
                        object.tasks[j] = $root.OracleJob.Task.toObject(message.tasks[j], options);
                }
                if (message.jobs && message.jobs.length) {
                    object.jobs = [];
                    for (var j = 0; j < message.jobs.length; ++j)
                        object.jobs[j] = $root.OracleJob.toObject(message.jobs[j], options);
                }
                if (message.minSuccessfulRequired != null && message.hasOwnProperty("minSuccessfulRequired"))
                    object.minSuccessfulRequired = message.minSuccessfulRequired;
                return object;
            };
    
            /**
             * Converts this MedianTask to JSON.
             * @function toJSON
             * @memberof OracleJob.MedianTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MedianTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return MedianTask;
        })();
    
        OracleJob.MeanTask = (function() {
    
            /**
             * Properties of a MeanTask.
             * @memberof OracleJob
             * @interface IMeanTask
             * @property {Array.<OracleJob.ITask>|null} [tasks] MeanTask tasks
             * @property {Array.<IOracleJob>|null} [jobs] MeanTask jobs
             */
    
            /**
             * Constructs a new MeanTask.
             * @memberof OracleJob
             * @classdesc Represents a MeanTask.
             * @implements IMeanTask
             * @constructor
             * @param {OracleJob.IMeanTask=} [properties] Properties to set
             */
            function MeanTask(properties) {
                this.tasks = [];
                this.jobs = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * MeanTask tasks.
             * @member {Array.<OracleJob.ITask>} tasks
             * @memberof OracleJob.MeanTask
             * @instance
             */
            MeanTask.prototype.tasks = $util.emptyArray;
    
            /**
             * MeanTask jobs.
             * @member {Array.<IOracleJob>} jobs
             * @memberof OracleJob.MeanTask
             * @instance
             */
            MeanTask.prototype.jobs = $util.emptyArray;
    
            /**
             * Creates a new MeanTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.MeanTask
             * @static
             * @param {OracleJob.IMeanTask=} [properties] Properties to set
             * @returns {OracleJob.MeanTask} MeanTask instance
             */
            MeanTask.create = function create(properties) {
                return new MeanTask(properties);
            };
    
            /**
             * Encodes the specified MeanTask message. Does not implicitly {@link OracleJob.MeanTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.MeanTask
             * @static
             * @param {OracleJob.IMeanTask} message MeanTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MeanTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.tasks != null && message.tasks.length)
                    for (var i = 0; i < message.tasks.length; ++i)
                        $root.OracleJob.Task.encode(message.tasks[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.jobs != null && message.jobs.length)
                    for (var i = 0; i < message.jobs.length; ++i)
                        $root.OracleJob.encode(message.jobs[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified MeanTask message, length delimited. Does not implicitly {@link OracleJob.MeanTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.MeanTask
             * @static
             * @param {OracleJob.IMeanTask} message MeanTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MeanTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a MeanTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.MeanTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.MeanTask} MeanTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MeanTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.MeanTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.tasks && message.tasks.length))
                            message.tasks = [];
                        message.tasks.push($root.OracleJob.Task.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        if (!(message.jobs && message.jobs.length))
                            message.jobs = [];
                        message.jobs.push($root.OracleJob.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a MeanTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.MeanTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.MeanTask} MeanTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MeanTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a MeanTask message.
             * @function verify
             * @memberof OracleJob.MeanTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MeanTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.tasks != null && message.hasOwnProperty("tasks")) {
                    if (!Array.isArray(message.tasks))
                        return "tasks: array expected";
                    for (var i = 0; i < message.tasks.length; ++i) {
                        var error = $root.OracleJob.Task.verify(message.tasks[i]);
                        if (error)
                            return "tasks." + error;
                    }
                }
                if (message.jobs != null && message.hasOwnProperty("jobs")) {
                    if (!Array.isArray(message.jobs))
                        return "jobs: array expected";
                    for (var i = 0; i < message.jobs.length; ++i) {
                        var error = $root.OracleJob.verify(message.jobs[i]);
                        if (error)
                            return "jobs." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a MeanTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.MeanTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.MeanTask} MeanTask
             */
            MeanTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.MeanTask)
                    return object;
                var message = new $root.OracleJob.MeanTask();
                if (object.tasks) {
                    if (!Array.isArray(object.tasks))
                        throw TypeError(".OracleJob.MeanTask.tasks: array expected");
                    message.tasks = [];
                    for (var i = 0; i < object.tasks.length; ++i) {
                        if (typeof object.tasks[i] !== "object")
                            throw TypeError(".OracleJob.MeanTask.tasks: object expected");
                        message.tasks[i] = $root.OracleJob.Task.fromObject(object.tasks[i]);
                    }
                }
                if (object.jobs) {
                    if (!Array.isArray(object.jobs))
                        throw TypeError(".OracleJob.MeanTask.jobs: array expected");
                    message.jobs = [];
                    for (var i = 0; i < object.jobs.length; ++i) {
                        if (typeof object.jobs[i] !== "object")
                            throw TypeError(".OracleJob.MeanTask.jobs: object expected");
                        message.jobs[i] = $root.OracleJob.fromObject(object.jobs[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a MeanTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.MeanTask
             * @static
             * @param {OracleJob.MeanTask} message MeanTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MeanTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.tasks = [];
                    object.jobs = [];
                }
                if (message.tasks && message.tasks.length) {
                    object.tasks = [];
                    for (var j = 0; j < message.tasks.length; ++j)
                        object.tasks[j] = $root.OracleJob.Task.toObject(message.tasks[j], options);
                }
                if (message.jobs && message.jobs.length) {
                    object.jobs = [];
                    for (var j = 0; j < message.jobs.length; ++j)
                        object.jobs[j] = $root.OracleJob.toObject(message.jobs[j], options);
                }
                return object;
            };
    
            /**
             * Converts this MeanTask to JSON.
             * @function toJSON
             * @memberof OracleJob.MeanTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MeanTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return MeanTask;
        })();
    
        OracleJob.MaxTask = (function() {
    
            /**
             * Properties of a MaxTask.
             * @memberof OracleJob
             * @interface IMaxTask
             * @property {Array.<OracleJob.ITask>|null} [tasks] MaxTask tasks
             * @property {Array.<IOracleJob>|null} [jobs] MaxTask jobs
             */
    
            /**
             * Constructs a new MaxTask.
             * @memberof OracleJob
             * @classdesc Represents a MaxTask.
             * @implements IMaxTask
             * @constructor
             * @param {OracleJob.IMaxTask=} [properties] Properties to set
             */
            function MaxTask(properties) {
                this.tasks = [];
                this.jobs = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * MaxTask tasks.
             * @member {Array.<OracleJob.ITask>} tasks
             * @memberof OracleJob.MaxTask
             * @instance
             */
            MaxTask.prototype.tasks = $util.emptyArray;
    
            /**
             * MaxTask jobs.
             * @member {Array.<IOracleJob>} jobs
             * @memberof OracleJob.MaxTask
             * @instance
             */
            MaxTask.prototype.jobs = $util.emptyArray;
    
            /**
             * Creates a new MaxTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.MaxTask
             * @static
             * @param {OracleJob.IMaxTask=} [properties] Properties to set
             * @returns {OracleJob.MaxTask} MaxTask instance
             */
            MaxTask.create = function create(properties) {
                return new MaxTask(properties);
            };
    
            /**
             * Encodes the specified MaxTask message. Does not implicitly {@link OracleJob.MaxTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.MaxTask
             * @static
             * @param {OracleJob.IMaxTask} message MaxTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MaxTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.tasks != null && message.tasks.length)
                    for (var i = 0; i < message.tasks.length; ++i)
                        $root.OracleJob.Task.encode(message.tasks[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.jobs != null && message.jobs.length)
                    for (var i = 0; i < message.jobs.length; ++i)
                        $root.OracleJob.encode(message.jobs[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified MaxTask message, length delimited. Does not implicitly {@link OracleJob.MaxTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.MaxTask
             * @static
             * @param {OracleJob.IMaxTask} message MaxTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MaxTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a MaxTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.MaxTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.MaxTask} MaxTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MaxTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.MaxTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.tasks && message.tasks.length))
                            message.tasks = [];
                        message.tasks.push($root.OracleJob.Task.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        if (!(message.jobs && message.jobs.length))
                            message.jobs = [];
                        message.jobs.push($root.OracleJob.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a MaxTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.MaxTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.MaxTask} MaxTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MaxTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a MaxTask message.
             * @function verify
             * @memberof OracleJob.MaxTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MaxTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.tasks != null && message.hasOwnProperty("tasks")) {
                    if (!Array.isArray(message.tasks))
                        return "tasks: array expected";
                    for (var i = 0; i < message.tasks.length; ++i) {
                        var error = $root.OracleJob.Task.verify(message.tasks[i]);
                        if (error)
                            return "tasks." + error;
                    }
                }
                if (message.jobs != null && message.hasOwnProperty("jobs")) {
                    if (!Array.isArray(message.jobs))
                        return "jobs: array expected";
                    for (var i = 0; i < message.jobs.length; ++i) {
                        var error = $root.OracleJob.verify(message.jobs[i]);
                        if (error)
                            return "jobs." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a MaxTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.MaxTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.MaxTask} MaxTask
             */
            MaxTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.MaxTask)
                    return object;
                var message = new $root.OracleJob.MaxTask();
                if (object.tasks) {
                    if (!Array.isArray(object.tasks))
                        throw TypeError(".OracleJob.MaxTask.tasks: array expected");
                    message.tasks = [];
                    for (var i = 0; i < object.tasks.length; ++i) {
                        if (typeof object.tasks[i] !== "object")
                            throw TypeError(".OracleJob.MaxTask.tasks: object expected");
                        message.tasks[i] = $root.OracleJob.Task.fromObject(object.tasks[i]);
                    }
                }
                if (object.jobs) {
                    if (!Array.isArray(object.jobs))
                        throw TypeError(".OracleJob.MaxTask.jobs: array expected");
                    message.jobs = [];
                    for (var i = 0; i < object.jobs.length; ++i) {
                        if (typeof object.jobs[i] !== "object")
                            throw TypeError(".OracleJob.MaxTask.jobs: object expected");
                        message.jobs[i] = $root.OracleJob.fromObject(object.jobs[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a MaxTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.MaxTask
             * @static
             * @param {OracleJob.MaxTask} message MaxTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MaxTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.tasks = [];
                    object.jobs = [];
                }
                if (message.tasks && message.tasks.length) {
                    object.tasks = [];
                    for (var j = 0; j < message.tasks.length; ++j)
                        object.tasks[j] = $root.OracleJob.Task.toObject(message.tasks[j], options);
                }
                if (message.jobs && message.jobs.length) {
                    object.jobs = [];
                    for (var j = 0; j < message.jobs.length; ++j)
                        object.jobs[j] = $root.OracleJob.toObject(message.jobs[j], options);
                }
                return object;
            };
    
            /**
             * Converts this MaxTask to JSON.
             * @function toJSON
             * @memberof OracleJob.MaxTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MaxTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return MaxTask;
        })();
    
        OracleJob.ValueTask = (function() {
    
            /**
             * Properties of a ValueTask.
             * @memberof OracleJob
             * @interface IValueTask
             * @property {number|null} [value] ValueTask value
             * @property {string|null} [aggregatorPubkey] ValueTask aggregatorPubkey
             * @property {string|null} [big] ValueTask big
             */
    
            /**
             * Constructs a new ValueTask.
             * @memberof OracleJob
             * @classdesc Represents a ValueTask.
             * @implements IValueTask
             * @constructor
             * @param {OracleJob.IValueTask=} [properties] Properties to set
             */
            function ValueTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * ValueTask value.
             * @member {number|null|undefined} value
             * @memberof OracleJob.ValueTask
             * @instance
             */
            ValueTask.prototype.value = null;
    
            /**
             * ValueTask aggregatorPubkey.
             * @member {string|null|undefined} aggregatorPubkey
             * @memberof OracleJob.ValueTask
             * @instance
             */
            ValueTask.prototype.aggregatorPubkey = null;
    
            /**
             * ValueTask big.
             * @member {string|null|undefined} big
             * @memberof OracleJob.ValueTask
             * @instance
             */
            ValueTask.prototype.big = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * ValueTask Value.
             * @member {"value"|"aggregatorPubkey"|"big"|undefined} Value
             * @memberof OracleJob.ValueTask
             * @instance
             */
            Object.defineProperty(ValueTask.prototype, "Value", {
                get: $util.oneOfGetter($oneOfFields = ["value", "aggregatorPubkey", "big"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new ValueTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.ValueTask
             * @static
             * @param {OracleJob.IValueTask=} [properties] Properties to set
             * @returns {OracleJob.ValueTask} ValueTask instance
             */
            ValueTask.create = function create(properties) {
                return new ValueTask(properties);
            };
    
            /**
             * Encodes the specified ValueTask message. Does not implicitly {@link OracleJob.ValueTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.ValueTask
             * @static
             * @param {OracleJob.IValueTask} message ValueTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ValueTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.value);
                if (message.aggregatorPubkey != null && Object.hasOwnProperty.call(message, "aggregatorPubkey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.aggregatorPubkey);
                if (message.big != null && Object.hasOwnProperty.call(message, "big"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.big);
                return writer;
            };
    
            /**
             * Encodes the specified ValueTask message, length delimited. Does not implicitly {@link OracleJob.ValueTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.ValueTask
             * @static
             * @param {OracleJob.IValueTask} message ValueTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ValueTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a ValueTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.ValueTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.ValueTask} ValueTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ValueTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.ValueTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.double();
                        break;
                    case 2:
                        message.aggregatorPubkey = reader.string();
                        break;
                    case 3:
                        message.big = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a ValueTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.ValueTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.ValueTask} ValueTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ValueTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a ValueTask message.
             * @function verify
             * @memberof OracleJob.ValueTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ValueTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.value != null && message.hasOwnProperty("value")) {
                    properties.Value = 1;
                    if (typeof message.value !== "number")
                        return "value: number expected";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    if (properties.Value === 1)
                        return "Value: multiple values";
                    properties.Value = 1;
                    if (!$util.isString(message.aggregatorPubkey))
                        return "aggregatorPubkey: string expected";
                }
                if (message.big != null && message.hasOwnProperty("big")) {
                    if (properties.Value === 1)
                        return "Value: multiple values";
                    properties.Value = 1;
                    if (!$util.isString(message.big))
                        return "big: string expected";
                }
                return null;
            };
    
            /**
             * Creates a ValueTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.ValueTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.ValueTask} ValueTask
             */
            ValueTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.ValueTask)
                    return object;
                var message = new $root.OracleJob.ValueTask();
                if (object.value != null)
                    message.value = Number(object.value);
                if (object.aggregatorPubkey != null)
                    message.aggregatorPubkey = String(object.aggregatorPubkey);
                if (object.big != null)
                    message.big = String(object.big);
                return message;
            };
    
            /**
             * Creates a plain object from a ValueTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.ValueTask
             * @static
             * @param {OracleJob.ValueTask} message ValueTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ValueTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.value != null && message.hasOwnProperty("value")) {
                    object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                    if (options.oneofs)
                        object.Value = "value";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    object.aggregatorPubkey = message.aggregatorPubkey;
                    if (options.oneofs)
                        object.Value = "aggregatorPubkey";
                }
                if (message.big != null && message.hasOwnProperty("big")) {
                    object.big = message.big;
                    if (options.oneofs)
                        object.Value = "big";
                }
                return object;
            };
    
            /**
             * Converts this ValueTask to JSON.
             * @function toJSON
             * @memberof OracleJob.ValueTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ValueTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return ValueTask;
        })();
    
        OracleJob.WebsocketTask = (function() {
    
            /**
             * Properties of a WebsocketTask.
             * @memberof OracleJob
             * @interface IWebsocketTask
             * @property {string|null} [url] WebsocketTask url
             * @property {string|null} [subscription] WebsocketTask subscription
             * @property {number|null} [maxDataAgeSeconds] WebsocketTask maxDataAgeSeconds
             * @property {string|null} [filter] WebsocketTask filter
             */
    
            /**
             * Constructs a new WebsocketTask.
             * @memberof OracleJob
             * @classdesc Represents a WebsocketTask.
             * @implements IWebsocketTask
             * @constructor
             * @param {OracleJob.IWebsocketTask=} [properties] Properties to set
             */
            function WebsocketTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * WebsocketTask url.
             * @member {string} url
             * @memberof OracleJob.WebsocketTask
             * @instance
             */
            WebsocketTask.prototype.url = "";
    
            /**
             * WebsocketTask subscription.
             * @member {string} subscription
             * @memberof OracleJob.WebsocketTask
             * @instance
             */
            WebsocketTask.prototype.subscription = "";
    
            /**
             * WebsocketTask maxDataAgeSeconds.
             * @member {number} maxDataAgeSeconds
             * @memberof OracleJob.WebsocketTask
             * @instance
             */
            WebsocketTask.prototype.maxDataAgeSeconds = 0;
    
            /**
             * WebsocketTask filter.
             * @member {string} filter
             * @memberof OracleJob.WebsocketTask
             * @instance
             */
            WebsocketTask.prototype.filter = "";
    
            /**
             * Creates a new WebsocketTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {OracleJob.IWebsocketTask=} [properties] Properties to set
             * @returns {OracleJob.WebsocketTask} WebsocketTask instance
             */
            WebsocketTask.create = function create(properties) {
                return new WebsocketTask(properties);
            };
    
            /**
             * Encodes the specified WebsocketTask message. Does not implicitly {@link OracleJob.WebsocketTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {OracleJob.IWebsocketTask} message WebsocketTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WebsocketTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
                if (message.subscription != null && Object.hasOwnProperty.call(message, "subscription"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.subscription);
                if (message.maxDataAgeSeconds != null && Object.hasOwnProperty.call(message, "maxDataAgeSeconds"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.maxDataAgeSeconds);
                if (message.filter != null && Object.hasOwnProperty.call(message, "filter"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.filter);
                return writer;
            };
    
            /**
             * Encodes the specified WebsocketTask message, length delimited. Does not implicitly {@link OracleJob.WebsocketTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {OracleJob.IWebsocketTask} message WebsocketTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WebsocketTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a WebsocketTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.WebsocketTask} WebsocketTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WebsocketTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.WebsocketTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.url = reader.string();
                        break;
                    case 2:
                        message.subscription = reader.string();
                        break;
                    case 3:
                        message.maxDataAgeSeconds = reader.int32();
                        break;
                    case 4:
                        message.filter = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a WebsocketTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.WebsocketTask} WebsocketTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WebsocketTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a WebsocketTask message.
             * @function verify
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            WebsocketTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.url != null && message.hasOwnProperty("url"))
                    if (!$util.isString(message.url))
                        return "url: string expected";
                if (message.subscription != null && message.hasOwnProperty("subscription"))
                    if (!$util.isString(message.subscription))
                        return "subscription: string expected";
                if (message.maxDataAgeSeconds != null && message.hasOwnProperty("maxDataAgeSeconds"))
                    if (!$util.isInteger(message.maxDataAgeSeconds))
                        return "maxDataAgeSeconds: integer expected";
                if (message.filter != null && message.hasOwnProperty("filter"))
                    if (!$util.isString(message.filter))
                        return "filter: string expected";
                return null;
            };
    
            /**
             * Creates a WebsocketTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.WebsocketTask} WebsocketTask
             */
            WebsocketTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.WebsocketTask)
                    return object;
                var message = new $root.OracleJob.WebsocketTask();
                if (object.url != null)
                    message.url = String(object.url);
                if (object.subscription != null)
                    message.subscription = String(object.subscription);
                if (object.maxDataAgeSeconds != null)
                    message.maxDataAgeSeconds = object.maxDataAgeSeconds | 0;
                if (object.filter != null)
                    message.filter = String(object.filter);
                return message;
            };
    
            /**
             * Creates a plain object from a WebsocketTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {OracleJob.WebsocketTask} message WebsocketTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            WebsocketTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.url = "";
                    object.subscription = "";
                    object.maxDataAgeSeconds = 0;
                    object.filter = "";
                }
                if (message.url != null && message.hasOwnProperty("url"))
                    object.url = message.url;
                if (message.subscription != null && message.hasOwnProperty("subscription"))
                    object.subscription = message.subscription;
                if (message.maxDataAgeSeconds != null && message.hasOwnProperty("maxDataAgeSeconds"))
                    object.maxDataAgeSeconds = message.maxDataAgeSeconds;
                if (message.filter != null && message.hasOwnProperty("filter"))
                    object.filter = message.filter;
                return object;
            };
    
            /**
             * Converts this WebsocketTask to JSON.
             * @function toJSON
             * @memberof OracleJob.WebsocketTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            WebsocketTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return WebsocketTask;
        })();
    
        OracleJob.ConditionalTask = (function() {
    
            /**
             * Properties of a ConditionalTask.
             * @memberof OracleJob
             * @interface IConditionalTask
             * @property {Array.<OracleJob.ITask>|null} [attempt] ConditionalTask attempt
             * @property {Array.<OracleJob.ITask>|null} [onFailure] ConditionalTask onFailure
             */
    
            /**
             * Constructs a new ConditionalTask.
             * @memberof OracleJob
             * @classdesc Represents a ConditionalTask.
             * @implements IConditionalTask
             * @constructor
             * @param {OracleJob.IConditionalTask=} [properties] Properties to set
             */
            function ConditionalTask(properties) {
                this.attempt = [];
                this.onFailure = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * ConditionalTask attempt.
             * @member {Array.<OracleJob.ITask>} attempt
             * @memberof OracleJob.ConditionalTask
             * @instance
             */
            ConditionalTask.prototype.attempt = $util.emptyArray;
    
            /**
             * ConditionalTask onFailure.
             * @member {Array.<OracleJob.ITask>} onFailure
             * @memberof OracleJob.ConditionalTask
             * @instance
             */
            ConditionalTask.prototype.onFailure = $util.emptyArray;
    
            /**
             * Creates a new ConditionalTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {OracleJob.IConditionalTask=} [properties] Properties to set
             * @returns {OracleJob.ConditionalTask} ConditionalTask instance
             */
            ConditionalTask.create = function create(properties) {
                return new ConditionalTask(properties);
            };
    
            /**
             * Encodes the specified ConditionalTask message. Does not implicitly {@link OracleJob.ConditionalTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {OracleJob.IConditionalTask} message ConditionalTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ConditionalTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.attempt != null && message.attempt.length)
                    for (var i = 0; i < message.attempt.length; ++i)
                        $root.OracleJob.Task.encode(message.attempt[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.onFailure != null && message.onFailure.length)
                    for (var i = 0; i < message.onFailure.length; ++i)
                        $root.OracleJob.Task.encode(message.onFailure[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified ConditionalTask message, length delimited. Does not implicitly {@link OracleJob.ConditionalTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {OracleJob.IConditionalTask} message ConditionalTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ConditionalTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a ConditionalTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.ConditionalTask} ConditionalTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ConditionalTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.ConditionalTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.attempt && message.attempt.length))
                            message.attempt = [];
                        message.attempt.push($root.OracleJob.Task.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        if (!(message.onFailure && message.onFailure.length))
                            message.onFailure = [];
                        message.onFailure.push($root.OracleJob.Task.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a ConditionalTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.ConditionalTask} ConditionalTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ConditionalTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a ConditionalTask message.
             * @function verify
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ConditionalTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.attempt != null && message.hasOwnProperty("attempt")) {
                    if (!Array.isArray(message.attempt))
                        return "attempt: array expected";
                    for (var i = 0; i < message.attempt.length; ++i) {
                        var error = $root.OracleJob.Task.verify(message.attempt[i]);
                        if (error)
                            return "attempt." + error;
                    }
                }
                if (message.onFailure != null && message.hasOwnProperty("onFailure")) {
                    if (!Array.isArray(message.onFailure))
                        return "onFailure: array expected";
                    for (var i = 0; i < message.onFailure.length; ++i) {
                        var error = $root.OracleJob.Task.verify(message.onFailure[i]);
                        if (error)
                            return "onFailure." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a ConditionalTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.ConditionalTask} ConditionalTask
             */
            ConditionalTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.ConditionalTask)
                    return object;
                var message = new $root.OracleJob.ConditionalTask();
                if (object.attempt) {
                    if (!Array.isArray(object.attempt))
                        throw TypeError(".OracleJob.ConditionalTask.attempt: array expected");
                    message.attempt = [];
                    for (var i = 0; i < object.attempt.length; ++i) {
                        if (typeof object.attempt[i] !== "object")
                            throw TypeError(".OracleJob.ConditionalTask.attempt: object expected");
                        message.attempt[i] = $root.OracleJob.Task.fromObject(object.attempt[i]);
                    }
                }
                if (object.onFailure) {
                    if (!Array.isArray(object.onFailure))
                        throw TypeError(".OracleJob.ConditionalTask.onFailure: array expected");
                    message.onFailure = [];
                    for (var i = 0; i < object.onFailure.length; ++i) {
                        if (typeof object.onFailure[i] !== "object")
                            throw TypeError(".OracleJob.ConditionalTask.onFailure: object expected");
                        message.onFailure[i] = $root.OracleJob.Task.fromObject(object.onFailure[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a ConditionalTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {OracleJob.ConditionalTask} message ConditionalTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ConditionalTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.attempt = [];
                    object.onFailure = [];
                }
                if (message.attempt && message.attempt.length) {
                    object.attempt = [];
                    for (var j = 0; j < message.attempt.length; ++j)
                        object.attempt[j] = $root.OracleJob.Task.toObject(message.attempt[j], options);
                }
                if (message.onFailure && message.onFailure.length) {
                    object.onFailure = [];
                    for (var j = 0; j < message.onFailure.length; ++j)
                        object.onFailure[j] = $root.OracleJob.Task.toObject(message.onFailure[j], options);
                }
                return object;
            };
    
            /**
             * Converts this ConditionalTask to JSON.
             * @function toJSON
             * @memberof OracleJob.ConditionalTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ConditionalTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return ConditionalTask;
        })();
    
        OracleJob.DivideTask = (function() {
    
            /**
             * Properties of a DivideTask.
             * @memberof OracleJob
             * @interface IDivideTask
             * @property {number|null} [scalar] DivideTask scalar
             * @property {string|null} [aggregatorPubkey] DivideTask aggregatorPubkey
             * @property {IOracleJob|null} [job] DivideTask job
             * @property {string|null} [big] DivideTask big
             */
    
            /**
             * Constructs a new DivideTask.
             * @memberof OracleJob
             * @classdesc Represents a DivideTask.
             * @implements IDivideTask
             * @constructor
             * @param {OracleJob.IDivideTask=} [properties] Properties to set
             */
            function DivideTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * DivideTask scalar.
             * @member {number|null|undefined} scalar
             * @memberof OracleJob.DivideTask
             * @instance
             */
            DivideTask.prototype.scalar = null;
    
            /**
             * DivideTask aggregatorPubkey.
             * @member {string|null|undefined} aggregatorPubkey
             * @memberof OracleJob.DivideTask
             * @instance
             */
            DivideTask.prototype.aggregatorPubkey = null;
    
            /**
             * DivideTask job.
             * @member {IOracleJob|null|undefined} job
             * @memberof OracleJob.DivideTask
             * @instance
             */
            DivideTask.prototype.job = null;
    
            /**
             * DivideTask big.
             * @member {string|null|undefined} big
             * @memberof OracleJob.DivideTask
             * @instance
             */
            DivideTask.prototype.big = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * DivideTask Denominator.
             * @member {"scalar"|"aggregatorPubkey"|"job"|"big"|undefined} Denominator
             * @memberof OracleJob.DivideTask
             * @instance
             */
            Object.defineProperty(DivideTask.prototype, "Denominator", {
                get: $util.oneOfGetter($oneOfFields = ["scalar", "aggregatorPubkey", "job", "big"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new DivideTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.DivideTask
             * @static
             * @param {OracleJob.IDivideTask=} [properties] Properties to set
             * @returns {OracleJob.DivideTask} DivideTask instance
             */
            DivideTask.create = function create(properties) {
                return new DivideTask(properties);
            };
    
            /**
             * Encodes the specified DivideTask message. Does not implicitly {@link OracleJob.DivideTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.DivideTask
             * @static
             * @param {OracleJob.IDivideTask} message DivideTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DivideTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.scalar != null && Object.hasOwnProperty.call(message, "scalar"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.scalar);
                if (message.aggregatorPubkey != null && Object.hasOwnProperty.call(message, "aggregatorPubkey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.aggregatorPubkey);
                if (message.job != null && Object.hasOwnProperty.call(message, "job"))
                    $root.OracleJob.encode(message.job, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.big != null && Object.hasOwnProperty.call(message, "big"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.big);
                return writer;
            };
    
            /**
             * Encodes the specified DivideTask message, length delimited. Does not implicitly {@link OracleJob.DivideTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.DivideTask
             * @static
             * @param {OracleJob.IDivideTask} message DivideTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DivideTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a DivideTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.DivideTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.DivideTask} DivideTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DivideTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.DivideTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.scalar = reader.double();
                        break;
                    case 2:
                        message.aggregatorPubkey = reader.string();
                        break;
                    case 3:
                        message.job = $root.OracleJob.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.big = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a DivideTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.DivideTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.DivideTask} DivideTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DivideTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a DivideTask message.
             * @function verify
             * @memberof OracleJob.DivideTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DivideTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    properties.Denominator = 1;
                    if (typeof message.scalar !== "number")
                        return "scalar: number expected";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    if (properties.Denominator === 1)
                        return "Denominator: multiple values";
                    properties.Denominator = 1;
                    if (!$util.isString(message.aggregatorPubkey))
                        return "aggregatorPubkey: string expected";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    if (properties.Denominator === 1)
                        return "Denominator: multiple values";
                    properties.Denominator = 1;
                    {
                        var error = $root.OracleJob.verify(message.job);
                        if (error)
                            return "job." + error;
                    }
                }
                if (message.big != null && message.hasOwnProperty("big")) {
                    if (properties.Denominator === 1)
                        return "Denominator: multiple values";
                    properties.Denominator = 1;
                    if (!$util.isString(message.big))
                        return "big: string expected";
                }
                return null;
            };
    
            /**
             * Creates a DivideTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.DivideTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.DivideTask} DivideTask
             */
            DivideTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.DivideTask)
                    return object;
                var message = new $root.OracleJob.DivideTask();
                if (object.scalar != null)
                    message.scalar = Number(object.scalar);
                if (object.aggregatorPubkey != null)
                    message.aggregatorPubkey = String(object.aggregatorPubkey);
                if (object.job != null) {
                    if (typeof object.job !== "object")
                        throw TypeError(".OracleJob.DivideTask.job: object expected");
                    message.job = $root.OracleJob.fromObject(object.job);
                }
                if (object.big != null)
                    message.big = String(object.big);
                return message;
            };
    
            /**
             * Creates a plain object from a DivideTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.DivideTask
             * @static
             * @param {OracleJob.DivideTask} message DivideTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DivideTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    object.scalar = options.json && !isFinite(message.scalar) ? String(message.scalar) : message.scalar;
                    if (options.oneofs)
                        object.Denominator = "scalar";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    object.aggregatorPubkey = message.aggregatorPubkey;
                    if (options.oneofs)
                        object.Denominator = "aggregatorPubkey";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    object.job = $root.OracleJob.toObject(message.job, options);
                    if (options.oneofs)
                        object.Denominator = "job";
                }
                if (message.big != null && message.hasOwnProperty("big")) {
                    object.big = message.big;
                    if (options.oneofs)
                        object.Denominator = "big";
                }
                return object;
            };
    
            /**
             * Converts this DivideTask to JSON.
             * @function toJSON
             * @memberof OracleJob.DivideTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DivideTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return DivideTask;
        })();
    
        OracleJob.MultiplyTask = (function() {
    
            /**
             * Properties of a MultiplyTask.
             * @memberof OracleJob
             * @interface IMultiplyTask
             * @property {number|null} [scalar] MultiplyTask scalar
             * @property {string|null} [aggregatorPubkey] MultiplyTask aggregatorPubkey
             * @property {IOracleJob|null} [job] MultiplyTask job
             * @property {string|null} [big] MultiplyTask big
             */
    
            /**
             * Constructs a new MultiplyTask.
             * @memberof OracleJob
             * @classdesc Represents a MultiplyTask.
             * @implements IMultiplyTask
             * @constructor
             * @param {OracleJob.IMultiplyTask=} [properties] Properties to set
             */
            function MultiplyTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * MultiplyTask scalar.
             * @member {number|null|undefined} scalar
             * @memberof OracleJob.MultiplyTask
             * @instance
             */
            MultiplyTask.prototype.scalar = null;
    
            /**
             * MultiplyTask aggregatorPubkey.
             * @member {string|null|undefined} aggregatorPubkey
             * @memberof OracleJob.MultiplyTask
             * @instance
             */
            MultiplyTask.prototype.aggregatorPubkey = null;
    
            /**
             * MultiplyTask job.
             * @member {IOracleJob|null|undefined} job
             * @memberof OracleJob.MultiplyTask
             * @instance
             */
            MultiplyTask.prototype.job = null;
    
            /**
             * MultiplyTask big.
             * @member {string|null|undefined} big
             * @memberof OracleJob.MultiplyTask
             * @instance
             */
            MultiplyTask.prototype.big = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * MultiplyTask Multiple.
             * @member {"scalar"|"aggregatorPubkey"|"job"|"big"|undefined} Multiple
             * @memberof OracleJob.MultiplyTask
             * @instance
             */
            Object.defineProperty(MultiplyTask.prototype, "Multiple", {
                get: $util.oneOfGetter($oneOfFields = ["scalar", "aggregatorPubkey", "job", "big"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new MultiplyTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {OracleJob.IMultiplyTask=} [properties] Properties to set
             * @returns {OracleJob.MultiplyTask} MultiplyTask instance
             */
            MultiplyTask.create = function create(properties) {
                return new MultiplyTask(properties);
            };
    
            /**
             * Encodes the specified MultiplyTask message. Does not implicitly {@link OracleJob.MultiplyTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {OracleJob.IMultiplyTask} message MultiplyTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MultiplyTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.scalar != null && Object.hasOwnProperty.call(message, "scalar"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.scalar);
                if (message.aggregatorPubkey != null && Object.hasOwnProperty.call(message, "aggregatorPubkey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.aggregatorPubkey);
                if (message.job != null && Object.hasOwnProperty.call(message, "job"))
                    $root.OracleJob.encode(message.job, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.big != null && Object.hasOwnProperty.call(message, "big"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.big);
                return writer;
            };
    
            /**
             * Encodes the specified MultiplyTask message, length delimited. Does not implicitly {@link OracleJob.MultiplyTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {OracleJob.IMultiplyTask} message MultiplyTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MultiplyTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a MultiplyTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.MultiplyTask} MultiplyTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MultiplyTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.MultiplyTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.scalar = reader.double();
                        break;
                    case 2:
                        message.aggregatorPubkey = reader.string();
                        break;
                    case 3:
                        message.job = $root.OracleJob.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.big = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a MultiplyTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.MultiplyTask} MultiplyTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MultiplyTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a MultiplyTask message.
             * @function verify
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MultiplyTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    properties.Multiple = 1;
                    if (typeof message.scalar !== "number")
                        return "scalar: number expected";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    if (properties.Multiple === 1)
                        return "Multiple: multiple values";
                    properties.Multiple = 1;
                    if (!$util.isString(message.aggregatorPubkey))
                        return "aggregatorPubkey: string expected";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    if (properties.Multiple === 1)
                        return "Multiple: multiple values";
                    properties.Multiple = 1;
                    {
                        var error = $root.OracleJob.verify(message.job);
                        if (error)
                            return "job." + error;
                    }
                }
                if (message.big != null && message.hasOwnProperty("big")) {
                    if (properties.Multiple === 1)
                        return "Multiple: multiple values";
                    properties.Multiple = 1;
                    if (!$util.isString(message.big))
                        return "big: string expected";
                }
                return null;
            };
    
            /**
             * Creates a MultiplyTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.MultiplyTask} MultiplyTask
             */
            MultiplyTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.MultiplyTask)
                    return object;
                var message = new $root.OracleJob.MultiplyTask();
                if (object.scalar != null)
                    message.scalar = Number(object.scalar);
                if (object.aggregatorPubkey != null)
                    message.aggregatorPubkey = String(object.aggregatorPubkey);
                if (object.job != null) {
                    if (typeof object.job !== "object")
                        throw TypeError(".OracleJob.MultiplyTask.job: object expected");
                    message.job = $root.OracleJob.fromObject(object.job);
                }
                if (object.big != null)
                    message.big = String(object.big);
                return message;
            };
    
            /**
             * Creates a plain object from a MultiplyTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {OracleJob.MultiplyTask} message MultiplyTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MultiplyTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    object.scalar = options.json && !isFinite(message.scalar) ? String(message.scalar) : message.scalar;
                    if (options.oneofs)
                        object.Multiple = "scalar";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    object.aggregatorPubkey = message.aggregatorPubkey;
                    if (options.oneofs)
                        object.Multiple = "aggregatorPubkey";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    object.job = $root.OracleJob.toObject(message.job, options);
                    if (options.oneofs)
                        object.Multiple = "job";
                }
                if (message.big != null && message.hasOwnProperty("big")) {
                    object.big = message.big;
                    if (options.oneofs)
                        object.Multiple = "big";
                }
                return object;
            };
    
            /**
             * Converts this MultiplyTask to JSON.
             * @function toJSON
             * @memberof OracleJob.MultiplyTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MultiplyTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return MultiplyTask;
        })();
    
        OracleJob.AddTask = (function() {
    
            /**
             * Properties of an AddTask.
             * @memberof OracleJob
             * @interface IAddTask
             * @property {number|null} [scalar] AddTask scalar
             * @property {string|null} [aggregatorPubkey] AddTask aggregatorPubkey
             * @property {IOracleJob|null} [job] AddTask job
             * @property {string|null} [big] AddTask big
             */
    
            /**
             * Constructs a new AddTask.
             * @memberof OracleJob
             * @classdesc Represents an AddTask.
             * @implements IAddTask
             * @constructor
             * @param {OracleJob.IAddTask=} [properties] Properties to set
             */
            function AddTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * AddTask scalar.
             * @member {number|null|undefined} scalar
             * @memberof OracleJob.AddTask
             * @instance
             */
            AddTask.prototype.scalar = null;
    
            /**
             * AddTask aggregatorPubkey.
             * @member {string|null|undefined} aggregatorPubkey
             * @memberof OracleJob.AddTask
             * @instance
             */
            AddTask.prototype.aggregatorPubkey = null;
    
            /**
             * AddTask job.
             * @member {IOracleJob|null|undefined} job
             * @memberof OracleJob.AddTask
             * @instance
             */
            AddTask.prototype.job = null;
    
            /**
             * AddTask big.
             * @member {string|null|undefined} big
             * @memberof OracleJob.AddTask
             * @instance
             */
            AddTask.prototype.big = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * AddTask Addition.
             * @member {"scalar"|"aggregatorPubkey"|"job"|"big"|undefined} Addition
             * @memberof OracleJob.AddTask
             * @instance
             */
            Object.defineProperty(AddTask.prototype, "Addition", {
                get: $util.oneOfGetter($oneOfFields = ["scalar", "aggregatorPubkey", "job", "big"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new AddTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.AddTask
             * @static
             * @param {OracleJob.IAddTask=} [properties] Properties to set
             * @returns {OracleJob.AddTask} AddTask instance
             */
            AddTask.create = function create(properties) {
                return new AddTask(properties);
            };
    
            /**
             * Encodes the specified AddTask message. Does not implicitly {@link OracleJob.AddTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.AddTask
             * @static
             * @param {OracleJob.IAddTask} message AddTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.scalar != null && Object.hasOwnProperty.call(message, "scalar"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.scalar);
                if (message.aggregatorPubkey != null && Object.hasOwnProperty.call(message, "aggregatorPubkey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.aggregatorPubkey);
                if (message.job != null && Object.hasOwnProperty.call(message, "job"))
                    $root.OracleJob.encode(message.job, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.big != null && Object.hasOwnProperty.call(message, "big"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.big);
                return writer;
            };
    
            /**
             * Encodes the specified AddTask message, length delimited. Does not implicitly {@link OracleJob.AddTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.AddTask
             * @static
             * @param {OracleJob.IAddTask} message AddTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an AddTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.AddTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.AddTask} AddTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.AddTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.scalar = reader.double();
                        break;
                    case 2:
                        message.aggregatorPubkey = reader.string();
                        break;
                    case 3:
                        message.job = $root.OracleJob.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.big = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an AddTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.AddTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.AddTask} AddTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an AddTask message.
             * @function verify
             * @memberof OracleJob.AddTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AddTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    properties.Addition = 1;
                    if (typeof message.scalar !== "number")
                        return "scalar: number expected";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    if (properties.Addition === 1)
                        return "Addition: multiple values";
                    properties.Addition = 1;
                    if (!$util.isString(message.aggregatorPubkey))
                        return "aggregatorPubkey: string expected";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    if (properties.Addition === 1)
                        return "Addition: multiple values";
                    properties.Addition = 1;
                    {
                        var error = $root.OracleJob.verify(message.job);
                        if (error)
                            return "job." + error;
                    }
                }
                if (message.big != null && message.hasOwnProperty("big")) {
                    if (properties.Addition === 1)
                        return "Addition: multiple values";
                    properties.Addition = 1;
                    if (!$util.isString(message.big))
                        return "big: string expected";
                }
                return null;
            };
    
            /**
             * Creates an AddTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.AddTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.AddTask} AddTask
             */
            AddTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.AddTask)
                    return object;
                var message = new $root.OracleJob.AddTask();
                if (object.scalar != null)
                    message.scalar = Number(object.scalar);
                if (object.aggregatorPubkey != null)
                    message.aggregatorPubkey = String(object.aggregatorPubkey);
                if (object.job != null) {
                    if (typeof object.job !== "object")
                        throw TypeError(".OracleJob.AddTask.job: object expected");
                    message.job = $root.OracleJob.fromObject(object.job);
                }
                if (object.big != null)
                    message.big = String(object.big);
                return message;
            };
    
            /**
             * Creates a plain object from an AddTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.AddTask
             * @static
             * @param {OracleJob.AddTask} message AddTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AddTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    object.scalar = options.json && !isFinite(message.scalar) ? String(message.scalar) : message.scalar;
                    if (options.oneofs)
                        object.Addition = "scalar";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    object.aggregatorPubkey = message.aggregatorPubkey;
                    if (options.oneofs)
                        object.Addition = "aggregatorPubkey";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    object.job = $root.OracleJob.toObject(message.job, options);
                    if (options.oneofs)
                        object.Addition = "job";
                }
                if (message.big != null && message.hasOwnProperty("big")) {
                    object.big = message.big;
                    if (options.oneofs)
                        object.Addition = "big";
                }
                return object;
            };
    
            /**
             * Converts this AddTask to JSON.
             * @function toJSON
             * @memberof OracleJob.AddTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AddTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return AddTask;
        })();
    
        OracleJob.SubtractTask = (function() {
    
            /**
             * Properties of a SubtractTask.
             * @memberof OracleJob
             * @interface ISubtractTask
             * @property {number|null} [scalar] SubtractTask scalar
             * @property {string|null} [aggregatorPubkey] SubtractTask aggregatorPubkey
             * @property {IOracleJob|null} [job] SubtractTask job
             * @property {string|null} [big] SubtractTask big
             */
    
            /**
             * Constructs a new SubtractTask.
             * @memberof OracleJob
             * @classdesc Represents a SubtractTask.
             * @implements ISubtractTask
             * @constructor
             * @param {OracleJob.ISubtractTask=} [properties] Properties to set
             */
            function SubtractTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SubtractTask scalar.
             * @member {number|null|undefined} scalar
             * @memberof OracleJob.SubtractTask
             * @instance
             */
            SubtractTask.prototype.scalar = null;
    
            /**
             * SubtractTask aggregatorPubkey.
             * @member {string|null|undefined} aggregatorPubkey
             * @memberof OracleJob.SubtractTask
             * @instance
             */
            SubtractTask.prototype.aggregatorPubkey = null;
    
            /**
             * SubtractTask job.
             * @member {IOracleJob|null|undefined} job
             * @memberof OracleJob.SubtractTask
             * @instance
             */
            SubtractTask.prototype.job = null;
    
            /**
             * SubtractTask big.
             * @member {string|null|undefined} big
             * @memberof OracleJob.SubtractTask
             * @instance
             */
            SubtractTask.prototype.big = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * SubtractTask Subtraction.
             * @member {"scalar"|"aggregatorPubkey"|"job"|"big"|undefined} Subtraction
             * @memberof OracleJob.SubtractTask
             * @instance
             */
            Object.defineProperty(SubtractTask.prototype, "Subtraction", {
                get: $util.oneOfGetter($oneOfFields = ["scalar", "aggregatorPubkey", "job", "big"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new SubtractTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {OracleJob.ISubtractTask=} [properties] Properties to set
             * @returns {OracleJob.SubtractTask} SubtractTask instance
             */
            SubtractTask.create = function create(properties) {
                return new SubtractTask(properties);
            };
    
            /**
             * Encodes the specified SubtractTask message. Does not implicitly {@link OracleJob.SubtractTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {OracleJob.ISubtractTask} message SubtractTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SubtractTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.scalar != null && Object.hasOwnProperty.call(message, "scalar"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.scalar);
                if (message.aggregatorPubkey != null && Object.hasOwnProperty.call(message, "aggregatorPubkey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.aggregatorPubkey);
                if (message.job != null && Object.hasOwnProperty.call(message, "job"))
                    $root.OracleJob.encode(message.job, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.big != null && Object.hasOwnProperty.call(message, "big"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.big);
                return writer;
            };
    
            /**
             * Encodes the specified SubtractTask message, length delimited. Does not implicitly {@link OracleJob.SubtractTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {OracleJob.ISubtractTask} message SubtractTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SubtractTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SubtractTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.SubtractTask} SubtractTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SubtractTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.SubtractTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.scalar = reader.double();
                        break;
                    case 2:
                        message.aggregatorPubkey = reader.string();
                        break;
                    case 3:
                        message.job = $root.OracleJob.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.big = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SubtractTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.SubtractTask} SubtractTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SubtractTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SubtractTask message.
             * @function verify
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SubtractTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    properties.Subtraction = 1;
                    if (typeof message.scalar !== "number")
                        return "scalar: number expected";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    if (properties.Subtraction === 1)
                        return "Subtraction: multiple values";
                    properties.Subtraction = 1;
                    if (!$util.isString(message.aggregatorPubkey))
                        return "aggregatorPubkey: string expected";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    if (properties.Subtraction === 1)
                        return "Subtraction: multiple values";
                    properties.Subtraction = 1;
                    {
                        var error = $root.OracleJob.verify(message.job);
                        if (error)
                            return "job." + error;
                    }
                }
                if (message.big != null && message.hasOwnProperty("big")) {
                    if (properties.Subtraction === 1)
                        return "Subtraction: multiple values";
                    properties.Subtraction = 1;
                    if (!$util.isString(message.big))
                        return "big: string expected";
                }
                return null;
            };
    
            /**
             * Creates a SubtractTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.SubtractTask} SubtractTask
             */
            SubtractTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.SubtractTask)
                    return object;
                var message = new $root.OracleJob.SubtractTask();
                if (object.scalar != null)
                    message.scalar = Number(object.scalar);
                if (object.aggregatorPubkey != null)
                    message.aggregatorPubkey = String(object.aggregatorPubkey);
                if (object.job != null) {
                    if (typeof object.job !== "object")
                        throw TypeError(".OracleJob.SubtractTask.job: object expected");
                    message.job = $root.OracleJob.fromObject(object.job);
                }
                if (object.big != null)
                    message.big = String(object.big);
                return message;
            };
    
            /**
             * Creates a plain object from a SubtractTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {OracleJob.SubtractTask} message SubtractTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SubtractTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    object.scalar = options.json && !isFinite(message.scalar) ? String(message.scalar) : message.scalar;
                    if (options.oneofs)
                        object.Subtraction = "scalar";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    object.aggregatorPubkey = message.aggregatorPubkey;
                    if (options.oneofs)
                        object.Subtraction = "aggregatorPubkey";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    object.job = $root.OracleJob.toObject(message.job, options);
                    if (options.oneofs)
                        object.Subtraction = "job";
                }
                if (message.big != null && message.hasOwnProperty("big")) {
                    object.big = message.big;
                    if (options.oneofs)
                        object.Subtraction = "big";
                }
                return object;
            };
    
            /**
             * Converts this SubtractTask to JSON.
             * @function toJSON
             * @memberof OracleJob.SubtractTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SubtractTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SubtractTask;
        })();
    
        OracleJob.LpTokenPriceTask = (function() {
    
            /**
             * Properties of a LpTokenPriceTask.
             * @memberof OracleJob
             * @interface ILpTokenPriceTask
             * @property {string|null} [mercurialPoolAddress] LpTokenPriceTask mercurialPoolAddress
             * @property {string|null} [saberPoolAddress] LpTokenPriceTask saberPoolAddress
             * @property {string|null} [orcaPoolAddress] LpTokenPriceTask orcaPoolAddress
             * @property {string|null} [raydiumPoolAddress] LpTokenPriceTask raydiumPoolAddress
             * @property {Array.<string>|null} [priceFeedAddresses] LpTokenPriceTask priceFeedAddresses
             * @property {Array.<IOracleJob>|null} [priceFeedJobs] LpTokenPriceTask priceFeedJobs
             * @property {boolean|null} [useFairPrice] LpTokenPriceTask useFairPrice
             */
    
            /**
             * Constructs a new LpTokenPriceTask.
             * @memberof OracleJob
             * @classdesc Represents a LpTokenPriceTask.
             * @implements ILpTokenPriceTask
             * @constructor
             * @param {OracleJob.ILpTokenPriceTask=} [properties] Properties to set
             */
            function LpTokenPriceTask(properties) {
                this.priceFeedAddresses = [];
                this.priceFeedJobs = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * LpTokenPriceTask mercurialPoolAddress.
             * @member {string|null|undefined} mercurialPoolAddress
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            LpTokenPriceTask.prototype.mercurialPoolAddress = null;
    
            /**
             * LpTokenPriceTask saberPoolAddress.
             * @member {string|null|undefined} saberPoolAddress
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            LpTokenPriceTask.prototype.saberPoolAddress = null;
    
            /**
             * LpTokenPriceTask orcaPoolAddress.
             * @member {string|null|undefined} orcaPoolAddress
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            LpTokenPriceTask.prototype.orcaPoolAddress = null;
    
            /**
             * LpTokenPriceTask raydiumPoolAddress.
             * @member {string|null|undefined} raydiumPoolAddress
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            LpTokenPriceTask.prototype.raydiumPoolAddress = null;
    
            /**
             * LpTokenPriceTask priceFeedAddresses.
             * @member {Array.<string>} priceFeedAddresses
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            LpTokenPriceTask.prototype.priceFeedAddresses = $util.emptyArray;
    
            /**
             * LpTokenPriceTask priceFeedJobs.
             * @member {Array.<IOracleJob>} priceFeedJobs
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            LpTokenPriceTask.prototype.priceFeedJobs = $util.emptyArray;
    
            /**
             * LpTokenPriceTask useFairPrice.
             * @member {boolean} useFairPrice
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            LpTokenPriceTask.prototype.useFairPrice = false;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * LpTokenPriceTask PoolAddress.
             * @member {"mercurialPoolAddress"|"saberPoolAddress"|"orcaPoolAddress"|"raydiumPoolAddress"|undefined} PoolAddress
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            Object.defineProperty(LpTokenPriceTask.prototype, "PoolAddress", {
                get: $util.oneOfGetter($oneOfFields = ["mercurialPoolAddress", "saberPoolAddress", "orcaPoolAddress", "raydiumPoolAddress"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new LpTokenPriceTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {OracleJob.ILpTokenPriceTask=} [properties] Properties to set
             * @returns {OracleJob.LpTokenPriceTask} LpTokenPriceTask instance
             */
            LpTokenPriceTask.create = function create(properties) {
                return new LpTokenPriceTask(properties);
            };
    
            /**
             * Encodes the specified LpTokenPriceTask message. Does not implicitly {@link OracleJob.LpTokenPriceTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {OracleJob.ILpTokenPriceTask} message LpTokenPriceTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LpTokenPriceTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.mercurialPoolAddress != null && Object.hasOwnProperty.call(message, "mercurialPoolAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.mercurialPoolAddress);
                if (message.saberPoolAddress != null && Object.hasOwnProperty.call(message, "saberPoolAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.saberPoolAddress);
                if (message.orcaPoolAddress != null && Object.hasOwnProperty.call(message, "orcaPoolAddress"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.orcaPoolAddress);
                if (message.raydiumPoolAddress != null && Object.hasOwnProperty.call(message, "raydiumPoolAddress"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.raydiumPoolAddress);
                if (message.priceFeedAddresses != null && message.priceFeedAddresses.length)
                    for (var i = 0; i < message.priceFeedAddresses.length; ++i)
                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.priceFeedAddresses[i]);
                if (message.priceFeedJobs != null && message.priceFeedJobs.length)
                    for (var i = 0; i < message.priceFeedJobs.length; ++i)
                        $root.OracleJob.encode(message.priceFeedJobs[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.useFairPrice != null && Object.hasOwnProperty.call(message, "useFairPrice"))
                    writer.uint32(/* id 7, wireType 0 =*/56).bool(message.useFairPrice);
                return writer;
            };
    
            /**
             * Encodes the specified LpTokenPriceTask message, length delimited. Does not implicitly {@link OracleJob.LpTokenPriceTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {OracleJob.ILpTokenPriceTask} message LpTokenPriceTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LpTokenPriceTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a LpTokenPriceTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.LpTokenPriceTask} LpTokenPriceTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LpTokenPriceTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.LpTokenPriceTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.mercurialPoolAddress = reader.string();
                        break;
                    case 2:
                        message.saberPoolAddress = reader.string();
                        break;
                    case 3:
                        message.orcaPoolAddress = reader.string();
                        break;
                    case 4:
                        message.raydiumPoolAddress = reader.string();
                        break;
                    case 5:
                        if (!(message.priceFeedAddresses && message.priceFeedAddresses.length))
                            message.priceFeedAddresses = [];
                        message.priceFeedAddresses.push(reader.string());
                        break;
                    case 6:
                        if (!(message.priceFeedJobs && message.priceFeedJobs.length))
                            message.priceFeedJobs = [];
                        message.priceFeedJobs.push($root.OracleJob.decode(reader, reader.uint32()));
                        break;
                    case 7:
                        message.useFairPrice = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a LpTokenPriceTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.LpTokenPriceTask} LpTokenPriceTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LpTokenPriceTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a LpTokenPriceTask message.
             * @function verify
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LpTokenPriceTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.mercurialPoolAddress != null && message.hasOwnProperty("mercurialPoolAddress")) {
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.mercurialPoolAddress))
                        return "mercurialPoolAddress: string expected";
                }
                if (message.saberPoolAddress != null && message.hasOwnProperty("saberPoolAddress")) {
                    if (properties.PoolAddress === 1)
                        return "PoolAddress: multiple values";
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.saberPoolAddress))
                        return "saberPoolAddress: string expected";
                }
                if (message.orcaPoolAddress != null && message.hasOwnProperty("orcaPoolAddress")) {
                    if (properties.PoolAddress === 1)
                        return "PoolAddress: multiple values";
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.orcaPoolAddress))
                        return "orcaPoolAddress: string expected";
                }
                if (message.raydiumPoolAddress != null && message.hasOwnProperty("raydiumPoolAddress")) {
                    if (properties.PoolAddress === 1)
                        return "PoolAddress: multiple values";
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.raydiumPoolAddress))
                        return "raydiumPoolAddress: string expected";
                }
                if (message.priceFeedAddresses != null && message.hasOwnProperty("priceFeedAddresses")) {
                    if (!Array.isArray(message.priceFeedAddresses))
                        return "priceFeedAddresses: array expected";
                    for (var i = 0; i < message.priceFeedAddresses.length; ++i)
                        if (!$util.isString(message.priceFeedAddresses[i]))
                            return "priceFeedAddresses: string[] expected";
                }
                if (message.priceFeedJobs != null && message.hasOwnProperty("priceFeedJobs")) {
                    if (!Array.isArray(message.priceFeedJobs))
                        return "priceFeedJobs: array expected";
                    for (var i = 0; i < message.priceFeedJobs.length; ++i) {
                        var error = $root.OracleJob.verify(message.priceFeedJobs[i]);
                        if (error)
                            return "priceFeedJobs." + error;
                    }
                }
                if (message.useFairPrice != null && message.hasOwnProperty("useFairPrice"))
                    if (typeof message.useFairPrice !== "boolean")
                        return "useFairPrice: boolean expected";
                return null;
            };
    
            /**
             * Creates a LpTokenPriceTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.LpTokenPriceTask} LpTokenPriceTask
             */
            LpTokenPriceTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.LpTokenPriceTask)
                    return object;
                var message = new $root.OracleJob.LpTokenPriceTask();
                if (object.mercurialPoolAddress != null)
                    message.mercurialPoolAddress = String(object.mercurialPoolAddress);
                if (object.saberPoolAddress != null)
                    message.saberPoolAddress = String(object.saberPoolAddress);
                if (object.orcaPoolAddress != null)
                    message.orcaPoolAddress = String(object.orcaPoolAddress);
                if (object.raydiumPoolAddress != null)
                    message.raydiumPoolAddress = String(object.raydiumPoolAddress);
                if (object.priceFeedAddresses) {
                    if (!Array.isArray(object.priceFeedAddresses))
                        throw TypeError(".OracleJob.LpTokenPriceTask.priceFeedAddresses: array expected");
                    message.priceFeedAddresses = [];
                    for (var i = 0; i < object.priceFeedAddresses.length; ++i)
                        message.priceFeedAddresses[i] = String(object.priceFeedAddresses[i]);
                }
                if (object.priceFeedJobs) {
                    if (!Array.isArray(object.priceFeedJobs))
                        throw TypeError(".OracleJob.LpTokenPriceTask.priceFeedJobs: array expected");
                    message.priceFeedJobs = [];
                    for (var i = 0; i < object.priceFeedJobs.length; ++i) {
                        if (typeof object.priceFeedJobs[i] !== "object")
                            throw TypeError(".OracleJob.LpTokenPriceTask.priceFeedJobs: object expected");
                        message.priceFeedJobs[i] = $root.OracleJob.fromObject(object.priceFeedJobs[i]);
                    }
                }
                if (object.useFairPrice != null)
                    message.useFairPrice = Boolean(object.useFairPrice);
                return message;
            };
    
            /**
             * Creates a plain object from a LpTokenPriceTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {OracleJob.LpTokenPriceTask} message LpTokenPriceTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LpTokenPriceTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.priceFeedAddresses = [];
                    object.priceFeedJobs = [];
                }
                if (options.defaults)
                    object.useFairPrice = false;
                if (message.mercurialPoolAddress != null && message.hasOwnProperty("mercurialPoolAddress")) {
                    object.mercurialPoolAddress = message.mercurialPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "mercurialPoolAddress";
                }
                if (message.saberPoolAddress != null && message.hasOwnProperty("saberPoolAddress")) {
                    object.saberPoolAddress = message.saberPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "saberPoolAddress";
                }
                if (message.orcaPoolAddress != null && message.hasOwnProperty("orcaPoolAddress")) {
                    object.orcaPoolAddress = message.orcaPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "orcaPoolAddress";
                }
                if (message.raydiumPoolAddress != null && message.hasOwnProperty("raydiumPoolAddress")) {
                    object.raydiumPoolAddress = message.raydiumPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "raydiumPoolAddress";
                }
                if (message.priceFeedAddresses && message.priceFeedAddresses.length) {
                    object.priceFeedAddresses = [];
                    for (var j = 0; j < message.priceFeedAddresses.length; ++j)
                        object.priceFeedAddresses[j] = message.priceFeedAddresses[j];
                }
                if (message.priceFeedJobs && message.priceFeedJobs.length) {
                    object.priceFeedJobs = [];
                    for (var j = 0; j < message.priceFeedJobs.length; ++j)
                        object.priceFeedJobs[j] = $root.OracleJob.toObject(message.priceFeedJobs[j], options);
                }
                if (message.useFairPrice != null && message.hasOwnProperty("useFairPrice"))
                    object.useFairPrice = message.useFairPrice;
                return object;
            };
    
            /**
             * Converts this LpTokenPriceTask to JSON.
             * @function toJSON
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LpTokenPriceTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return LpTokenPriceTask;
        })();
    
        OracleJob.LpExchangeRateTask = (function() {
    
            /**
             * Properties of a LpExchangeRateTask.
             * @memberof OracleJob
             * @interface ILpExchangeRateTask
             * @property {string|null} [inTokenAddress] LpExchangeRateTask inTokenAddress
             * @property {string|null} [outTokenAddress] LpExchangeRateTask outTokenAddress
             * @property {string|null} [mercurialPoolAddress] LpExchangeRateTask mercurialPoolAddress
             * @property {string|null} [saberPoolAddress] LpExchangeRateTask saberPoolAddress
             * @property {string|null} [orcaPoolTokenMintAddress] LpExchangeRateTask orcaPoolTokenMintAddress
             * @property {string|null} [raydiumPoolAddress] LpExchangeRateTask raydiumPoolAddress
             * @property {string|null} [orcaPoolAddress] LpExchangeRateTask orcaPoolAddress
             * @property {string|null} [portReserveAddress] LpExchangeRateTask portReserveAddress
             */
    
            /**
             * Constructs a new LpExchangeRateTask.
             * @memberof OracleJob
             * @classdesc Represents a LpExchangeRateTask.
             * @implements ILpExchangeRateTask
             * @constructor
             * @param {OracleJob.ILpExchangeRateTask=} [properties] Properties to set
             */
            function LpExchangeRateTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * LpExchangeRateTask inTokenAddress.
             * @member {string} inTokenAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            LpExchangeRateTask.prototype.inTokenAddress = "";
    
            /**
             * LpExchangeRateTask outTokenAddress.
             * @member {string} outTokenAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            LpExchangeRateTask.prototype.outTokenAddress = "";
    
            /**
             * LpExchangeRateTask mercurialPoolAddress.
             * @member {string|null|undefined} mercurialPoolAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            LpExchangeRateTask.prototype.mercurialPoolAddress = null;
    
            /**
             * LpExchangeRateTask saberPoolAddress.
             * @member {string|null|undefined} saberPoolAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            LpExchangeRateTask.prototype.saberPoolAddress = null;
    
            /**
             * LpExchangeRateTask orcaPoolTokenMintAddress.
             * @member {string|null|undefined} orcaPoolTokenMintAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            LpExchangeRateTask.prototype.orcaPoolTokenMintAddress = null;
    
            /**
             * LpExchangeRateTask raydiumPoolAddress.
             * @member {string|null|undefined} raydiumPoolAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            LpExchangeRateTask.prototype.raydiumPoolAddress = null;
    
            /**
             * LpExchangeRateTask orcaPoolAddress.
             * @member {string|null|undefined} orcaPoolAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            LpExchangeRateTask.prototype.orcaPoolAddress = null;
    
            /**
             * LpExchangeRateTask portReserveAddress.
             * @member {string|null|undefined} portReserveAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            LpExchangeRateTask.prototype.portReserveAddress = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * LpExchangeRateTask PoolAddress.
             * @member {"mercurialPoolAddress"|"saberPoolAddress"|"orcaPoolTokenMintAddress"|"raydiumPoolAddress"|"orcaPoolAddress"|"portReserveAddress"|undefined} PoolAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            Object.defineProperty(LpExchangeRateTask.prototype, "PoolAddress", {
                get: $util.oneOfGetter($oneOfFields = ["mercurialPoolAddress", "saberPoolAddress", "orcaPoolTokenMintAddress", "raydiumPoolAddress", "orcaPoolAddress", "portReserveAddress"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new LpExchangeRateTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {OracleJob.ILpExchangeRateTask=} [properties] Properties to set
             * @returns {OracleJob.LpExchangeRateTask} LpExchangeRateTask instance
             */
            LpExchangeRateTask.create = function create(properties) {
                return new LpExchangeRateTask(properties);
            };
    
            /**
             * Encodes the specified LpExchangeRateTask message. Does not implicitly {@link OracleJob.LpExchangeRateTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {OracleJob.ILpExchangeRateTask} message LpExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LpExchangeRateTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.inTokenAddress != null && Object.hasOwnProperty.call(message, "inTokenAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.inTokenAddress);
                if (message.outTokenAddress != null && Object.hasOwnProperty.call(message, "outTokenAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.outTokenAddress);
                if (message.mercurialPoolAddress != null && Object.hasOwnProperty.call(message, "mercurialPoolAddress"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.mercurialPoolAddress);
                if (message.saberPoolAddress != null && Object.hasOwnProperty.call(message, "saberPoolAddress"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.saberPoolAddress);
                if (message.orcaPoolTokenMintAddress != null && Object.hasOwnProperty.call(message, "orcaPoolTokenMintAddress"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.orcaPoolTokenMintAddress);
                if (message.raydiumPoolAddress != null && Object.hasOwnProperty.call(message, "raydiumPoolAddress"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.raydiumPoolAddress);
                if (message.orcaPoolAddress != null && Object.hasOwnProperty.call(message, "orcaPoolAddress"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.orcaPoolAddress);
                if (message.portReserveAddress != null && Object.hasOwnProperty.call(message, "portReserveAddress"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.portReserveAddress);
                return writer;
            };
    
            /**
             * Encodes the specified LpExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.LpExchangeRateTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {OracleJob.ILpExchangeRateTask} message LpExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LpExchangeRateTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a LpExchangeRateTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.LpExchangeRateTask} LpExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LpExchangeRateTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.LpExchangeRateTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.inTokenAddress = reader.string();
                        break;
                    case 2:
                        message.outTokenAddress = reader.string();
                        break;
                    case 3:
                        message.mercurialPoolAddress = reader.string();
                        break;
                    case 4:
                        message.saberPoolAddress = reader.string();
                        break;
                    case 5:
                        message.orcaPoolTokenMintAddress = reader.string();
                        break;
                    case 6:
                        message.raydiumPoolAddress = reader.string();
                        break;
                    case 7:
                        message.orcaPoolAddress = reader.string();
                        break;
                    case 8:
                        message.portReserveAddress = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a LpExchangeRateTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.LpExchangeRateTask} LpExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LpExchangeRateTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a LpExchangeRateTask message.
             * @function verify
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LpExchangeRateTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    if (!$util.isString(message.inTokenAddress))
                        return "inTokenAddress: string expected";
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    if (!$util.isString(message.outTokenAddress))
                        return "outTokenAddress: string expected";
                if (message.mercurialPoolAddress != null && message.hasOwnProperty("mercurialPoolAddress")) {
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.mercurialPoolAddress))
                        return "mercurialPoolAddress: string expected";
                }
                if (message.saberPoolAddress != null && message.hasOwnProperty("saberPoolAddress")) {
                    if (properties.PoolAddress === 1)
                        return "PoolAddress: multiple values";
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.saberPoolAddress))
                        return "saberPoolAddress: string expected";
                }
                if (message.orcaPoolTokenMintAddress != null && message.hasOwnProperty("orcaPoolTokenMintAddress")) {
                    if (properties.PoolAddress === 1)
                        return "PoolAddress: multiple values";
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.orcaPoolTokenMintAddress))
                        return "orcaPoolTokenMintAddress: string expected";
                }
                if (message.raydiumPoolAddress != null && message.hasOwnProperty("raydiumPoolAddress")) {
                    if (properties.PoolAddress === 1)
                        return "PoolAddress: multiple values";
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.raydiumPoolAddress))
                        return "raydiumPoolAddress: string expected";
                }
                if (message.orcaPoolAddress != null && message.hasOwnProperty("orcaPoolAddress")) {
                    if (properties.PoolAddress === 1)
                        return "PoolAddress: multiple values";
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.orcaPoolAddress))
                        return "orcaPoolAddress: string expected";
                }
                if (message.portReserveAddress != null && message.hasOwnProperty("portReserveAddress")) {
                    if (properties.PoolAddress === 1)
                        return "PoolAddress: multiple values";
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.portReserveAddress))
                        return "portReserveAddress: string expected";
                }
                return null;
            };
    
            /**
             * Creates a LpExchangeRateTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.LpExchangeRateTask} LpExchangeRateTask
             */
            LpExchangeRateTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.LpExchangeRateTask)
                    return object;
                var message = new $root.OracleJob.LpExchangeRateTask();
                if (object.inTokenAddress != null)
                    message.inTokenAddress = String(object.inTokenAddress);
                if (object.outTokenAddress != null)
                    message.outTokenAddress = String(object.outTokenAddress);
                if (object.mercurialPoolAddress != null)
                    message.mercurialPoolAddress = String(object.mercurialPoolAddress);
                if (object.saberPoolAddress != null)
                    message.saberPoolAddress = String(object.saberPoolAddress);
                if (object.orcaPoolTokenMintAddress != null)
                    message.orcaPoolTokenMintAddress = String(object.orcaPoolTokenMintAddress);
                if (object.raydiumPoolAddress != null)
                    message.raydiumPoolAddress = String(object.raydiumPoolAddress);
                if (object.orcaPoolAddress != null)
                    message.orcaPoolAddress = String(object.orcaPoolAddress);
                if (object.portReserveAddress != null)
                    message.portReserveAddress = String(object.portReserveAddress);
                return message;
            };
    
            /**
             * Creates a plain object from a LpExchangeRateTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {OracleJob.LpExchangeRateTask} message LpExchangeRateTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LpExchangeRateTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.inTokenAddress = "";
                    object.outTokenAddress = "";
                }
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    object.inTokenAddress = message.inTokenAddress;
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    object.outTokenAddress = message.outTokenAddress;
                if (message.mercurialPoolAddress != null && message.hasOwnProperty("mercurialPoolAddress")) {
                    object.mercurialPoolAddress = message.mercurialPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "mercurialPoolAddress";
                }
                if (message.saberPoolAddress != null && message.hasOwnProperty("saberPoolAddress")) {
                    object.saberPoolAddress = message.saberPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "saberPoolAddress";
                }
                if (message.orcaPoolTokenMintAddress != null && message.hasOwnProperty("orcaPoolTokenMintAddress")) {
                    object.orcaPoolTokenMintAddress = message.orcaPoolTokenMintAddress;
                    if (options.oneofs)
                        object.PoolAddress = "orcaPoolTokenMintAddress";
                }
                if (message.raydiumPoolAddress != null && message.hasOwnProperty("raydiumPoolAddress")) {
                    object.raydiumPoolAddress = message.raydiumPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "raydiumPoolAddress";
                }
                if (message.orcaPoolAddress != null && message.hasOwnProperty("orcaPoolAddress")) {
                    object.orcaPoolAddress = message.orcaPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "orcaPoolAddress";
                }
                if (message.portReserveAddress != null && message.hasOwnProperty("portReserveAddress")) {
                    object.portReserveAddress = message.portReserveAddress;
                    if (options.oneofs)
                        object.PoolAddress = "portReserveAddress";
                }
                return object;
            };
    
            /**
             * Converts this LpExchangeRateTask to JSON.
             * @function toJSON
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LpExchangeRateTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return LpExchangeRateTask;
        })();
    
        OracleJob.RegexExtractTask = (function() {
    
            /**
             * Properties of a RegexExtractTask.
             * @memberof OracleJob
             * @interface IRegexExtractTask
             * @property {string|null} [pattern] RegexExtractTask pattern
             * @property {number|null} [groupNumber] RegexExtractTask groupNumber
             */
    
            /**
             * Constructs a new RegexExtractTask.
             * @memberof OracleJob
             * @classdesc Represents a RegexExtractTask.
             * @implements IRegexExtractTask
             * @constructor
             * @param {OracleJob.IRegexExtractTask=} [properties] Properties to set
             */
            function RegexExtractTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * RegexExtractTask pattern.
             * @member {string} pattern
             * @memberof OracleJob.RegexExtractTask
             * @instance
             */
            RegexExtractTask.prototype.pattern = "";
    
            /**
             * RegexExtractTask groupNumber.
             * @member {number} groupNumber
             * @memberof OracleJob.RegexExtractTask
             * @instance
             */
            RegexExtractTask.prototype.groupNumber = 0;
    
            /**
             * Creates a new RegexExtractTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {OracleJob.IRegexExtractTask=} [properties] Properties to set
             * @returns {OracleJob.RegexExtractTask} RegexExtractTask instance
             */
            RegexExtractTask.create = function create(properties) {
                return new RegexExtractTask(properties);
            };
    
            /**
             * Encodes the specified RegexExtractTask message. Does not implicitly {@link OracleJob.RegexExtractTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {OracleJob.IRegexExtractTask} message RegexExtractTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RegexExtractTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.pattern != null && Object.hasOwnProperty.call(message, "pattern"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.pattern);
                if (message.groupNumber != null && Object.hasOwnProperty.call(message, "groupNumber"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.groupNumber);
                return writer;
            };
    
            /**
             * Encodes the specified RegexExtractTask message, length delimited. Does not implicitly {@link OracleJob.RegexExtractTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {OracleJob.IRegexExtractTask} message RegexExtractTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RegexExtractTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a RegexExtractTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.RegexExtractTask} RegexExtractTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RegexExtractTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.RegexExtractTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.pattern = reader.string();
                        break;
                    case 2:
                        message.groupNumber = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a RegexExtractTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.RegexExtractTask} RegexExtractTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RegexExtractTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a RegexExtractTask message.
             * @function verify
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RegexExtractTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.pattern != null && message.hasOwnProperty("pattern"))
                    if (!$util.isString(message.pattern))
                        return "pattern: string expected";
                if (message.groupNumber != null && message.hasOwnProperty("groupNumber"))
                    if (!$util.isInteger(message.groupNumber))
                        return "groupNumber: integer expected";
                return null;
            };
    
            /**
             * Creates a RegexExtractTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.RegexExtractTask} RegexExtractTask
             */
            RegexExtractTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.RegexExtractTask)
                    return object;
                var message = new $root.OracleJob.RegexExtractTask();
                if (object.pattern != null)
                    message.pattern = String(object.pattern);
                if (object.groupNumber != null)
                    message.groupNumber = object.groupNumber | 0;
                return message;
            };
    
            /**
             * Creates a plain object from a RegexExtractTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {OracleJob.RegexExtractTask} message RegexExtractTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RegexExtractTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.pattern = "";
                    object.groupNumber = 0;
                }
                if (message.pattern != null && message.hasOwnProperty("pattern"))
                    object.pattern = message.pattern;
                if (message.groupNumber != null && message.hasOwnProperty("groupNumber"))
                    object.groupNumber = message.groupNumber;
                return object;
            };
    
            /**
             * Converts this RegexExtractTask to JSON.
             * @function toJSON
             * @memberof OracleJob.RegexExtractTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RegexExtractTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return RegexExtractTask;
        })();
    
        OracleJob.XStepPriceTask = (function() {
    
            /**
             * Properties of a XStepPriceTask.
             * @memberof OracleJob
             * @interface IXStepPriceTask
             * @property {OracleJob.IMedianTask|null} [stepJob] XStepPriceTask stepJob
             * @property {string|null} [stepAggregatorPubkey] XStepPriceTask stepAggregatorPubkey
             */
    
            /**
             * Constructs a new XStepPriceTask.
             * @memberof OracleJob
             * @classdesc Represents a XStepPriceTask.
             * @implements IXStepPriceTask
             * @constructor
             * @param {OracleJob.IXStepPriceTask=} [properties] Properties to set
             */
            function XStepPriceTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * XStepPriceTask stepJob.
             * @member {OracleJob.IMedianTask|null|undefined} stepJob
             * @memberof OracleJob.XStepPriceTask
             * @instance
             */
            XStepPriceTask.prototype.stepJob = null;
    
            /**
             * XStepPriceTask stepAggregatorPubkey.
             * @member {string|null|undefined} stepAggregatorPubkey
             * @memberof OracleJob.XStepPriceTask
             * @instance
             */
            XStepPriceTask.prototype.stepAggregatorPubkey = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * XStepPriceTask StepSource.
             * @member {"stepJob"|"stepAggregatorPubkey"|undefined} StepSource
             * @memberof OracleJob.XStepPriceTask
             * @instance
             */
            Object.defineProperty(XStepPriceTask.prototype, "StepSource", {
                get: $util.oneOfGetter($oneOfFields = ["stepJob", "stepAggregatorPubkey"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new XStepPriceTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {OracleJob.IXStepPriceTask=} [properties] Properties to set
             * @returns {OracleJob.XStepPriceTask} XStepPriceTask instance
             */
            XStepPriceTask.create = function create(properties) {
                return new XStepPriceTask(properties);
            };
    
            /**
             * Encodes the specified XStepPriceTask message. Does not implicitly {@link OracleJob.XStepPriceTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {OracleJob.IXStepPriceTask} message XStepPriceTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            XStepPriceTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.stepJob != null && Object.hasOwnProperty.call(message, "stepJob"))
                    $root.OracleJob.MedianTask.encode(message.stepJob, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.stepAggregatorPubkey != null && Object.hasOwnProperty.call(message, "stepAggregatorPubkey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.stepAggregatorPubkey);
                return writer;
            };
    
            /**
             * Encodes the specified XStepPriceTask message, length delimited. Does not implicitly {@link OracleJob.XStepPriceTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {OracleJob.IXStepPriceTask} message XStepPriceTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            XStepPriceTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a XStepPriceTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.XStepPriceTask} XStepPriceTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            XStepPriceTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.XStepPriceTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.stepJob = $root.OracleJob.MedianTask.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.stepAggregatorPubkey = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a XStepPriceTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.XStepPriceTask} XStepPriceTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            XStepPriceTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a XStepPriceTask message.
             * @function verify
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            XStepPriceTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.stepJob != null && message.hasOwnProperty("stepJob")) {
                    properties.StepSource = 1;
                    {
                        var error = $root.OracleJob.MedianTask.verify(message.stepJob);
                        if (error)
                            return "stepJob." + error;
                    }
                }
                if (message.stepAggregatorPubkey != null && message.hasOwnProperty("stepAggregatorPubkey")) {
                    if (properties.StepSource === 1)
                        return "StepSource: multiple values";
                    properties.StepSource = 1;
                    if (!$util.isString(message.stepAggregatorPubkey))
                        return "stepAggregatorPubkey: string expected";
                }
                return null;
            };
    
            /**
             * Creates a XStepPriceTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.XStepPriceTask} XStepPriceTask
             */
            XStepPriceTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.XStepPriceTask)
                    return object;
                var message = new $root.OracleJob.XStepPriceTask();
                if (object.stepJob != null) {
                    if (typeof object.stepJob !== "object")
                        throw TypeError(".OracleJob.XStepPriceTask.stepJob: object expected");
                    message.stepJob = $root.OracleJob.MedianTask.fromObject(object.stepJob);
                }
                if (object.stepAggregatorPubkey != null)
                    message.stepAggregatorPubkey = String(object.stepAggregatorPubkey);
                return message;
            };
    
            /**
             * Creates a plain object from a XStepPriceTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {OracleJob.XStepPriceTask} message XStepPriceTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            XStepPriceTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.stepJob != null && message.hasOwnProperty("stepJob")) {
                    object.stepJob = $root.OracleJob.MedianTask.toObject(message.stepJob, options);
                    if (options.oneofs)
                        object.StepSource = "stepJob";
                }
                if (message.stepAggregatorPubkey != null && message.hasOwnProperty("stepAggregatorPubkey")) {
                    object.stepAggregatorPubkey = message.stepAggregatorPubkey;
                    if (options.oneofs)
                        object.StepSource = "stepAggregatorPubkey";
                }
                return object;
            };
    
            /**
             * Converts this XStepPriceTask to JSON.
             * @function toJSON
             * @memberof OracleJob.XStepPriceTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            XStepPriceTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return XStepPriceTask;
        })();
    
        OracleJob.TwapTask = (function() {
    
            /**
             * Properties of a TwapTask.
             * @memberof OracleJob
             * @interface ITwapTask
             * @property {string|null} [aggregatorPubkey] TwapTask aggregatorPubkey
             * @property {number|null} [period] TwapTask period
             * @property {boolean|null} [weightByPropagationTime] TwapTask weightByPropagationTime
             * @property {number|null} [minSamples] TwapTask minSamples
             * @property {number|null} [endingUnixTimestamp] TwapTask endingUnixTimestamp
             * @property {OracleJob.ICronParseTask|null} [endingUnixTimestampTask] TwapTask endingUnixTimestampTask
             */
    
            /**
             * Constructs a new TwapTask.
             * @memberof OracleJob
             * @classdesc Represents a TwapTask.
             * @implements ITwapTask
             * @constructor
             * @param {OracleJob.ITwapTask=} [properties] Properties to set
             */
            function TwapTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * TwapTask aggregatorPubkey.
             * @member {string} aggregatorPubkey
             * @memberof OracleJob.TwapTask
             * @instance
             */
            TwapTask.prototype.aggregatorPubkey = "";
    
            /**
             * TwapTask period.
             * @member {number} period
             * @memberof OracleJob.TwapTask
             * @instance
             */
            TwapTask.prototype.period = 0;
    
            /**
             * TwapTask weightByPropagationTime.
             * @member {boolean} weightByPropagationTime
             * @memberof OracleJob.TwapTask
             * @instance
             */
            TwapTask.prototype.weightByPropagationTime = false;
    
            /**
             * TwapTask minSamples.
             * @member {number} minSamples
             * @memberof OracleJob.TwapTask
             * @instance
             */
            TwapTask.prototype.minSamples = 0;
    
            /**
             * TwapTask endingUnixTimestamp.
             * @member {number} endingUnixTimestamp
             * @memberof OracleJob.TwapTask
             * @instance
             */
            TwapTask.prototype.endingUnixTimestamp = 0;
    
            /**
             * TwapTask endingUnixTimestampTask.
             * @member {OracleJob.ICronParseTask|null|undefined} endingUnixTimestampTask
             * @memberof OracleJob.TwapTask
             * @instance
             */
            TwapTask.prototype.endingUnixTimestampTask = null;
    
            /**
             * Creates a new TwapTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.TwapTask
             * @static
             * @param {OracleJob.ITwapTask=} [properties] Properties to set
             * @returns {OracleJob.TwapTask} TwapTask instance
             */
            TwapTask.create = function create(properties) {
                return new TwapTask(properties);
            };
    
            /**
             * Encodes the specified TwapTask message. Does not implicitly {@link OracleJob.TwapTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.TwapTask
             * @static
             * @param {OracleJob.ITwapTask} message TwapTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TwapTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.aggregatorPubkey != null && Object.hasOwnProperty.call(message, "aggregatorPubkey"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.aggregatorPubkey);
                if (message.period != null && Object.hasOwnProperty.call(message, "period"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.period);
                if (message.weightByPropagationTime != null && Object.hasOwnProperty.call(message, "weightByPropagationTime"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.weightByPropagationTime);
                if (message.minSamples != null && Object.hasOwnProperty.call(message, "minSamples"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.minSamples);
                if (message.endingUnixTimestamp != null && Object.hasOwnProperty.call(message, "endingUnixTimestamp"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.endingUnixTimestamp);
                if (message.endingUnixTimestampTask != null && Object.hasOwnProperty.call(message, "endingUnixTimestampTask"))
                    $root.OracleJob.CronParseTask.encode(message.endingUnixTimestampTask, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified TwapTask message, length delimited. Does not implicitly {@link OracleJob.TwapTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.TwapTask
             * @static
             * @param {OracleJob.ITwapTask} message TwapTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TwapTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a TwapTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.TwapTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.TwapTask} TwapTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TwapTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.TwapTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.aggregatorPubkey = reader.string();
                        break;
                    case 2:
                        message.period = reader.int32();
                        break;
                    case 3:
                        message.weightByPropagationTime = reader.bool();
                        break;
                    case 4:
                        message.minSamples = reader.uint32();
                        break;
                    case 5:
                        message.endingUnixTimestamp = reader.int32();
                        break;
                    case 6:
                        message.endingUnixTimestampTask = $root.OracleJob.CronParseTask.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a TwapTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.TwapTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.TwapTask} TwapTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TwapTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a TwapTask message.
             * @function verify
             * @memberof OracleJob.TwapTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TwapTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey"))
                    if (!$util.isString(message.aggregatorPubkey))
                        return "aggregatorPubkey: string expected";
                if (message.period != null && message.hasOwnProperty("period"))
                    if (!$util.isInteger(message.period))
                        return "period: integer expected";
                if (message.weightByPropagationTime != null && message.hasOwnProperty("weightByPropagationTime"))
                    if (typeof message.weightByPropagationTime !== "boolean")
                        return "weightByPropagationTime: boolean expected";
                if (message.minSamples != null && message.hasOwnProperty("minSamples"))
                    if (!$util.isInteger(message.minSamples))
                        return "minSamples: integer expected";
                if (message.endingUnixTimestamp != null && message.hasOwnProperty("endingUnixTimestamp"))
                    if (!$util.isInteger(message.endingUnixTimestamp))
                        return "endingUnixTimestamp: integer expected";
                if (message.endingUnixTimestampTask != null && message.hasOwnProperty("endingUnixTimestampTask")) {
                    var error = $root.OracleJob.CronParseTask.verify(message.endingUnixTimestampTask);
                    if (error)
                        return "endingUnixTimestampTask." + error;
                }
                return null;
            };
    
            /**
             * Creates a TwapTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.TwapTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.TwapTask} TwapTask
             */
            TwapTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.TwapTask)
                    return object;
                var message = new $root.OracleJob.TwapTask();
                if (object.aggregatorPubkey != null)
                    message.aggregatorPubkey = String(object.aggregatorPubkey);
                if (object.period != null)
                    message.period = object.period | 0;
                if (object.weightByPropagationTime != null)
                    message.weightByPropagationTime = Boolean(object.weightByPropagationTime);
                if (object.minSamples != null)
                    message.minSamples = object.minSamples >>> 0;
                if (object.endingUnixTimestamp != null)
                    message.endingUnixTimestamp = object.endingUnixTimestamp | 0;
                if (object.endingUnixTimestampTask != null) {
                    if (typeof object.endingUnixTimestampTask !== "object")
                        throw TypeError(".OracleJob.TwapTask.endingUnixTimestampTask: object expected");
                    message.endingUnixTimestampTask = $root.OracleJob.CronParseTask.fromObject(object.endingUnixTimestampTask);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a TwapTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.TwapTask
             * @static
             * @param {OracleJob.TwapTask} message TwapTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TwapTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.aggregatorPubkey = "";
                    object.period = 0;
                    object.weightByPropagationTime = false;
                    object.minSamples = 0;
                    object.endingUnixTimestamp = 0;
                    object.endingUnixTimestampTask = null;
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey"))
                    object.aggregatorPubkey = message.aggregatorPubkey;
                if (message.period != null && message.hasOwnProperty("period"))
                    object.period = message.period;
                if (message.weightByPropagationTime != null && message.hasOwnProperty("weightByPropagationTime"))
                    object.weightByPropagationTime = message.weightByPropagationTime;
                if (message.minSamples != null && message.hasOwnProperty("minSamples"))
                    object.minSamples = message.minSamples;
                if (message.endingUnixTimestamp != null && message.hasOwnProperty("endingUnixTimestamp"))
                    object.endingUnixTimestamp = message.endingUnixTimestamp;
                if (message.endingUnixTimestampTask != null && message.hasOwnProperty("endingUnixTimestampTask"))
                    object.endingUnixTimestampTask = $root.OracleJob.CronParseTask.toObject(message.endingUnixTimestampTask, options);
                return object;
            };
    
            /**
             * Converts this TwapTask to JSON.
             * @function toJSON
             * @memberof OracleJob.TwapTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TwapTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return TwapTask;
        })();
    
        OracleJob.SerumSwapTask = (function() {
    
            /**
             * Properties of a SerumSwapTask.
             * @memberof OracleJob
             * @interface ISerumSwapTask
             * @property {string|null} [serumPoolAddress] SerumSwapTask serumPoolAddress
             */
    
            /**
             * Constructs a new SerumSwapTask.
             * @memberof OracleJob
             * @classdesc Represents a SerumSwapTask.
             * @implements ISerumSwapTask
             * @constructor
             * @param {OracleJob.ISerumSwapTask=} [properties] Properties to set
             */
            function SerumSwapTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SerumSwapTask serumPoolAddress.
             * @member {string} serumPoolAddress
             * @memberof OracleJob.SerumSwapTask
             * @instance
             */
            SerumSwapTask.prototype.serumPoolAddress = "";
    
            /**
             * Creates a new SerumSwapTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {OracleJob.ISerumSwapTask=} [properties] Properties to set
             * @returns {OracleJob.SerumSwapTask} SerumSwapTask instance
             */
            SerumSwapTask.create = function create(properties) {
                return new SerumSwapTask(properties);
            };
    
            /**
             * Encodes the specified SerumSwapTask message. Does not implicitly {@link OracleJob.SerumSwapTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {OracleJob.ISerumSwapTask} message SerumSwapTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SerumSwapTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.serumPoolAddress != null && Object.hasOwnProperty.call(message, "serumPoolAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.serumPoolAddress);
                return writer;
            };
    
            /**
             * Encodes the specified SerumSwapTask message, length delimited. Does not implicitly {@link OracleJob.SerumSwapTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {OracleJob.ISerumSwapTask} message SerumSwapTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SerumSwapTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SerumSwapTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.SerumSwapTask} SerumSwapTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SerumSwapTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.SerumSwapTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.serumPoolAddress = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SerumSwapTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.SerumSwapTask} SerumSwapTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SerumSwapTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SerumSwapTask message.
             * @function verify
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SerumSwapTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.serumPoolAddress != null && message.hasOwnProperty("serumPoolAddress"))
                    if (!$util.isString(message.serumPoolAddress))
                        return "serumPoolAddress: string expected";
                return null;
            };
    
            /**
             * Creates a SerumSwapTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.SerumSwapTask} SerumSwapTask
             */
            SerumSwapTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.SerumSwapTask)
                    return object;
                var message = new $root.OracleJob.SerumSwapTask();
                if (object.serumPoolAddress != null)
                    message.serumPoolAddress = String(object.serumPoolAddress);
                return message;
            };
    
            /**
             * Creates a plain object from a SerumSwapTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {OracleJob.SerumSwapTask} message SerumSwapTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SerumSwapTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.serumPoolAddress = "";
                if (message.serumPoolAddress != null && message.hasOwnProperty("serumPoolAddress"))
                    object.serumPoolAddress = message.serumPoolAddress;
                return object;
            };
    
            /**
             * Converts this SerumSwapTask to JSON.
             * @function toJSON
             * @memberof OracleJob.SerumSwapTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SerumSwapTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SerumSwapTask;
        })();
    
        OracleJob.PowTask = (function() {
    
            /**
             * Properties of a PowTask.
             * @memberof OracleJob
             * @interface IPowTask
             * @property {number|null} [scalar] PowTask scalar
             * @property {string|null} [aggregatorPubkey] PowTask aggregatorPubkey
             * @property {string|null} [big] PowTask big
             */
    
            /**
             * Constructs a new PowTask.
             * @memberof OracleJob
             * @classdesc Represents a PowTask.
             * @implements IPowTask
             * @constructor
             * @param {OracleJob.IPowTask=} [properties] Properties to set
             */
            function PowTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * PowTask scalar.
             * @member {number|null|undefined} scalar
             * @memberof OracleJob.PowTask
             * @instance
             */
            PowTask.prototype.scalar = null;
    
            /**
             * PowTask aggregatorPubkey.
             * @member {string|null|undefined} aggregatorPubkey
             * @memberof OracleJob.PowTask
             * @instance
             */
            PowTask.prototype.aggregatorPubkey = null;
    
            /**
             * PowTask big.
             * @member {string|null|undefined} big
             * @memberof OracleJob.PowTask
             * @instance
             */
            PowTask.prototype.big = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * PowTask Exponent.
             * @member {"scalar"|"aggregatorPubkey"|"big"|undefined} Exponent
             * @memberof OracleJob.PowTask
             * @instance
             */
            Object.defineProperty(PowTask.prototype, "Exponent", {
                get: $util.oneOfGetter($oneOfFields = ["scalar", "aggregatorPubkey", "big"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new PowTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.PowTask
             * @static
             * @param {OracleJob.IPowTask=} [properties] Properties to set
             * @returns {OracleJob.PowTask} PowTask instance
             */
            PowTask.create = function create(properties) {
                return new PowTask(properties);
            };
    
            /**
             * Encodes the specified PowTask message. Does not implicitly {@link OracleJob.PowTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.PowTask
             * @static
             * @param {OracleJob.IPowTask} message PowTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PowTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.scalar != null && Object.hasOwnProperty.call(message, "scalar"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.scalar);
                if (message.aggregatorPubkey != null && Object.hasOwnProperty.call(message, "aggregatorPubkey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.aggregatorPubkey);
                if (message.big != null && Object.hasOwnProperty.call(message, "big"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.big);
                return writer;
            };
    
            /**
             * Encodes the specified PowTask message, length delimited. Does not implicitly {@link OracleJob.PowTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.PowTask
             * @static
             * @param {OracleJob.IPowTask} message PowTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PowTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a PowTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.PowTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.PowTask} PowTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PowTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.PowTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.scalar = reader.double();
                        break;
                    case 2:
                        message.aggregatorPubkey = reader.string();
                        break;
                    case 3:
                        message.big = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a PowTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.PowTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.PowTask} PowTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PowTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a PowTask message.
             * @function verify
             * @memberof OracleJob.PowTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PowTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    properties.Exponent = 1;
                    if (typeof message.scalar !== "number")
                        return "scalar: number expected";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    if (properties.Exponent === 1)
                        return "Exponent: multiple values";
                    properties.Exponent = 1;
                    if (!$util.isString(message.aggregatorPubkey))
                        return "aggregatorPubkey: string expected";
                }
                if (message.big != null && message.hasOwnProperty("big")) {
                    if (properties.Exponent === 1)
                        return "Exponent: multiple values";
                    properties.Exponent = 1;
                    if (!$util.isString(message.big))
                        return "big: string expected";
                }
                return null;
            };
    
            /**
             * Creates a PowTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.PowTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.PowTask} PowTask
             */
            PowTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.PowTask)
                    return object;
                var message = new $root.OracleJob.PowTask();
                if (object.scalar != null)
                    message.scalar = Number(object.scalar);
                if (object.aggregatorPubkey != null)
                    message.aggregatorPubkey = String(object.aggregatorPubkey);
                if (object.big != null)
                    message.big = String(object.big);
                return message;
            };
    
            /**
             * Creates a plain object from a PowTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.PowTask
             * @static
             * @param {OracleJob.PowTask} message PowTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PowTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    object.scalar = options.json && !isFinite(message.scalar) ? String(message.scalar) : message.scalar;
                    if (options.oneofs)
                        object.Exponent = "scalar";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    object.aggregatorPubkey = message.aggregatorPubkey;
                    if (options.oneofs)
                        object.Exponent = "aggregatorPubkey";
                }
                if (message.big != null && message.hasOwnProperty("big")) {
                    object.big = message.big;
                    if (options.oneofs)
                        object.Exponent = "big";
                }
                return object;
            };
    
            /**
             * Converts this PowTask to JSON.
             * @function toJSON
             * @memberof OracleJob.PowTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PowTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return PowTask;
        })();
    
        OracleJob.LendingRateTask = (function() {
    
            /**
             * Properties of a LendingRateTask.
             * @memberof OracleJob
             * @interface ILendingRateTask
             * @property {string|null} [protocol] LendingRateTask protocol
             * @property {string|null} [assetMint] LendingRateTask assetMint
             * @property {OracleJob.LendingRateTask.Field|null} [field] LendingRateTask field
             */
    
            /**
             * Constructs a new LendingRateTask.
             * @memberof OracleJob
             * @classdesc Represents a LendingRateTask.
             * @implements ILendingRateTask
             * @constructor
             * @param {OracleJob.ILendingRateTask=} [properties] Properties to set
             */
            function LendingRateTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * LendingRateTask protocol.
             * @member {string} protocol
             * @memberof OracleJob.LendingRateTask
             * @instance
             */
            LendingRateTask.prototype.protocol = "";
    
            /**
             * LendingRateTask assetMint.
             * @member {string} assetMint
             * @memberof OracleJob.LendingRateTask
             * @instance
             */
            LendingRateTask.prototype.assetMint = "";
    
            /**
             * LendingRateTask field.
             * @member {OracleJob.LendingRateTask.Field} field
             * @memberof OracleJob.LendingRateTask
             * @instance
             */
            LendingRateTask.prototype.field = 0;
    
            /**
             * Creates a new LendingRateTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {OracleJob.ILendingRateTask=} [properties] Properties to set
             * @returns {OracleJob.LendingRateTask} LendingRateTask instance
             */
            LendingRateTask.create = function create(properties) {
                return new LendingRateTask(properties);
            };
    
            /**
             * Encodes the specified LendingRateTask message. Does not implicitly {@link OracleJob.LendingRateTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {OracleJob.ILendingRateTask} message LendingRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LendingRateTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.protocol != null && Object.hasOwnProperty.call(message, "protocol"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.protocol);
                if (message.assetMint != null && Object.hasOwnProperty.call(message, "assetMint"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.assetMint);
                if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.field);
                return writer;
            };
    
            /**
             * Encodes the specified LendingRateTask message, length delimited. Does not implicitly {@link OracleJob.LendingRateTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {OracleJob.ILendingRateTask} message LendingRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LendingRateTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a LendingRateTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.LendingRateTask} LendingRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LendingRateTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.LendingRateTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.protocol = reader.string();
                        break;
                    case 2:
                        message.assetMint = reader.string();
                        break;
                    case 3:
                        message.field = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a LendingRateTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.LendingRateTask} LendingRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LendingRateTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a LendingRateTask message.
             * @function verify
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LendingRateTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.protocol != null && message.hasOwnProperty("protocol"))
                    if (!$util.isString(message.protocol))
                        return "protocol: string expected";
                if (message.assetMint != null && message.hasOwnProperty("assetMint"))
                    if (!$util.isString(message.assetMint))
                        return "assetMint: string expected";
                if (message.field != null && message.hasOwnProperty("field"))
                    switch (message.field) {
                    default:
                        return "field: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                return null;
            };
    
            /**
             * Creates a LendingRateTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.LendingRateTask} LendingRateTask
             */
            LendingRateTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.LendingRateTask)
                    return object;
                var message = new $root.OracleJob.LendingRateTask();
                if (object.protocol != null)
                    message.protocol = String(object.protocol);
                if (object.assetMint != null)
                    message.assetMint = String(object.assetMint);
                switch (object.field) {
                case "FIELD_DEPOSIT_RATE":
                case 0:
                    message.field = 0;
                    break;
                case "FIELD_BORROW_RATE":
                case 1:
                    message.field = 1;
                    break;
                }
                return message;
            };
    
            /**
             * Creates a plain object from a LendingRateTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {OracleJob.LendingRateTask} message LendingRateTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LendingRateTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.protocol = "";
                    object.assetMint = "";
                    object.field = options.enums === String ? "FIELD_DEPOSIT_RATE" : 0;
                }
                if (message.protocol != null && message.hasOwnProperty("protocol"))
                    object.protocol = message.protocol;
                if (message.assetMint != null && message.hasOwnProperty("assetMint"))
                    object.assetMint = message.assetMint;
                if (message.field != null && message.hasOwnProperty("field"))
                    object.field = options.enums === String ? $root.OracleJob.LendingRateTask.Field[message.field] : message.field;
                return object;
            };
    
            /**
             * Converts this LendingRateTask to JSON.
             * @function toJSON
             * @memberof OracleJob.LendingRateTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LendingRateTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            /**
             * Field enum.
             * @name OracleJob.LendingRateTask.Field
             * @enum {number}
             * @property {number} FIELD_DEPOSIT_RATE=0 FIELD_DEPOSIT_RATE value
             * @property {number} FIELD_BORROW_RATE=1 FIELD_BORROW_RATE value
             */
            LendingRateTask.Field = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "FIELD_DEPOSIT_RATE"] = 0;
                values[valuesById[1] = "FIELD_BORROW_RATE"] = 1;
                return values;
            })();
    
            return LendingRateTask;
        })();
    
        OracleJob.MangoPerpMarketTask = (function() {
    
            /**
             * Properties of a MangoPerpMarketTask.
             * @memberof OracleJob
             * @interface IMangoPerpMarketTask
             * @property {string|null} [perpMarketAddress] MangoPerpMarketTask perpMarketAddress
             */
    
            /**
             * Constructs a new MangoPerpMarketTask.
             * @memberof OracleJob
             * @classdesc Represents a MangoPerpMarketTask.
             * @implements IMangoPerpMarketTask
             * @constructor
             * @param {OracleJob.IMangoPerpMarketTask=} [properties] Properties to set
             */
            function MangoPerpMarketTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * MangoPerpMarketTask perpMarketAddress.
             * @member {string} perpMarketAddress
             * @memberof OracleJob.MangoPerpMarketTask
             * @instance
             */
            MangoPerpMarketTask.prototype.perpMarketAddress = "";
    
            /**
             * Creates a new MangoPerpMarketTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {OracleJob.IMangoPerpMarketTask=} [properties] Properties to set
             * @returns {OracleJob.MangoPerpMarketTask} MangoPerpMarketTask instance
             */
            MangoPerpMarketTask.create = function create(properties) {
                return new MangoPerpMarketTask(properties);
            };
    
            /**
             * Encodes the specified MangoPerpMarketTask message. Does not implicitly {@link OracleJob.MangoPerpMarketTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {OracleJob.IMangoPerpMarketTask} message MangoPerpMarketTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MangoPerpMarketTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.perpMarketAddress != null && Object.hasOwnProperty.call(message, "perpMarketAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.perpMarketAddress);
                return writer;
            };
    
            /**
             * Encodes the specified MangoPerpMarketTask message, length delimited. Does not implicitly {@link OracleJob.MangoPerpMarketTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {OracleJob.IMangoPerpMarketTask} message MangoPerpMarketTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MangoPerpMarketTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a MangoPerpMarketTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.MangoPerpMarketTask} MangoPerpMarketTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MangoPerpMarketTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.MangoPerpMarketTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.perpMarketAddress = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a MangoPerpMarketTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.MangoPerpMarketTask} MangoPerpMarketTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MangoPerpMarketTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a MangoPerpMarketTask message.
             * @function verify
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MangoPerpMarketTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.perpMarketAddress != null && message.hasOwnProperty("perpMarketAddress"))
                    if (!$util.isString(message.perpMarketAddress))
                        return "perpMarketAddress: string expected";
                return null;
            };
    
            /**
             * Creates a MangoPerpMarketTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.MangoPerpMarketTask} MangoPerpMarketTask
             */
            MangoPerpMarketTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.MangoPerpMarketTask)
                    return object;
                var message = new $root.OracleJob.MangoPerpMarketTask();
                if (object.perpMarketAddress != null)
                    message.perpMarketAddress = String(object.perpMarketAddress);
                return message;
            };
    
            /**
             * Creates a plain object from a MangoPerpMarketTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {OracleJob.MangoPerpMarketTask} message MangoPerpMarketTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MangoPerpMarketTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.perpMarketAddress = "";
                if (message.perpMarketAddress != null && message.hasOwnProperty("perpMarketAddress"))
                    object.perpMarketAddress = message.perpMarketAddress;
                return object;
            };
    
            /**
             * Converts this MangoPerpMarketTask to JSON.
             * @function toJSON
             * @memberof OracleJob.MangoPerpMarketTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MangoPerpMarketTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return MangoPerpMarketTask;
        })();
    
        OracleJob.JupiterSwapTask = (function() {
    
            /**
             * Properties of a JupiterSwapTask.
             * @memberof OracleJob
             * @interface IJupiterSwapTask
             * @property {string|null} [inTokenAddress] JupiterSwapTask inTokenAddress
             * @property {string|null} [outTokenAddress] JupiterSwapTask outTokenAddress
             * @property {number|null} [baseAmount] JupiterSwapTask baseAmount
             */
    
            /**
             * Constructs a new JupiterSwapTask.
             * @memberof OracleJob
             * @classdesc Represents a JupiterSwapTask.
             * @implements IJupiterSwapTask
             * @constructor
             * @param {OracleJob.IJupiterSwapTask=} [properties] Properties to set
             */
            function JupiterSwapTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * JupiterSwapTask inTokenAddress.
             * @member {string} inTokenAddress
             * @memberof OracleJob.JupiterSwapTask
             * @instance
             */
            JupiterSwapTask.prototype.inTokenAddress = "";
    
            /**
             * JupiterSwapTask outTokenAddress.
             * @member {string} outTokenAddress
             * @memberof OracleJob.JupiterSwapTask
             * @instance
             */
            JupiterSwapTask.prototype.outTokenAddress = "";
    
            /**
             * JupiterSwapTask baseAmount.
             * @member {number} baseAmount
             * @memberof OracleJob.JupiterSwapTask
             * @instance
             */
            JupiterSwapTask.prototype.baseAmount = 0;
    
            /**
             * Creates a new JupiterSwapTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {OracleJob.IJupiterSwapTask=} [properties] Properties to set
             * @returns {OracleJob.JupiterSwapTask} JupiterSwapTask instance
             */
            JupiterSwapTask.create = function create(properties) {
                return new JupiterSwapTask(properties);
            };
    
            /**
             * Encodes the specified JupiterSwapTask message. Does not implicitly {@link OracleJob.JupiterSwapTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {OracleJob.IJupiterSwapTask} message JupiterSwapTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            JupiterSwapTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.inTokenAddress != null && Object.hasOwnProperty.call(message, "inTokenAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.inTokenAddress);
                if (message.outTokenAddress != null && Object.hasOwnProperty.call(message, "outTokenAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.outTokenAddress);
                if (message.baseAmount != null && Object.hasOwnProperty.call(message, "baseAmount"))
                    writer.uint32(/* id 3, wireType 1 =*/25).double(message.baseAmount);
                return writer;
            };
    
            /**
             * Encodes the specified JupiterSwapTask message, length delimited. Does not implicitly {@link OracleJob.JupiterSwapTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {OracleJob.IJupiterSwapTask} message JupiterSwapTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            JupiterSwapTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a JupiterSwapTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.JupiterSwapTask} JupiterSwapTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            JupiterSwapTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.JupiterSwapTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.inTokenAddress = reader.string();
                        break;
                    case 2:
                        message.outTokenAddress = reader.string();
                        break;
                    case 3:
                        message.baseAmount = reader.double();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a JupiterSwapTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.JupiterSwapTask} JupiterSwapTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            JupiterSwapTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a JupiterSwapTask message.
             * @function verify
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            JupiterSwapTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    if (!$util.isString(message.inTokenAddress))
                        return "inTokenAddress: string expected";
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    if (!$util.isString(message.outTokenAddress))
                        return "outTokenAddress: string expected";
                if (message.baseAmount != null && message.hasOwnProperty("baseAmount"))
                    if (typeof message.baseAmount !== "number")
                        return "baseAmount: number expected";
                return null;
            };
    
            /**
             * Creates a JupiterSwapTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.JupiterSwapTask} JupiterSwapTask
             */
            JupiterSwapTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.JupiterSwapTask)
                    return object;
                var message = new $root.OracleJob.JupiterSwapTask();
                if (object.inTokenAddress != null)
                    message.inTokenAddress = String(object.inTokenAddress);
                if (object.outTokenAddress != null)
                    message.outTokenAddress = String(object.outTokenAddress);
                if (object.baseAmount != null)
                    message.baseAmount = Number(object.baseAmount);
                return message;
            };
    
            /**
             * Creates a plain object from a JupiterSwapTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {OracleJob.JupiterSwapTask} message JupiterSwapTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            JupiterSwapTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.inTokenAddress = "";
                    object.outTokenAddress = "";
                    object.baseAmount = 0;
                }
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    object.inTokenAddress = message.inTokenAddress;
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    object.outTokenAddress = message.outTokenAddress;
                if (message.baseAmount != null && message.hasOwnProperty("baseAmount"))
                    object.baseAmount = options.json && !isFinite(message.baseAmount) ? String(message.baseAmount) : message.baseAmount;
                return object;
            };
    
            /**
             * Converts this JupiterSwapTask to JSON.
             * @function toJSON
             * @memberof OracleJob.JupiterSwapTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            JupiterSwapTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return JupiterSwapTask;
        })();
    
        OracleJob.PerpMarketTask = (function() {
    
            /**
             * Properties of a PerpMarketTask.
             * @memberof OracleJob
             * @interface IPerpMarketTask
             * @property {string|null} [mangoMarketAddress] PerpMarketTask mangoMarketAddress
             * @property {string|null} [driftMarketAddress] PerpMarketTask driftMarketAddress
             * @property {string|null} [zetaMarketAddress] PerpMarketTask zetaMarketAddress
             * @property {string|null} [zoMarketAddress] PerpMarketTask zoMarketAddress
             */
    
            /**
             * Constructs a new PerpMarketTask.
             * @memberof OracleJob
             * @classdesc Represents a PerpMarketTask.
             * @implements IPerpMarketTask
             * @constructor
             * @param {OracleJob.IPerpMarketTask=} [properties] Properties to set
             */
            function PerpMarketTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * PerpMarketTask mangoMarketAddress.
             * @member {string|null|undefined} mangoMarketAddress
             * @memberof OracleJob.PerpMarketTask
             * @instance
             */
            PerpMarketTask.prototype.mangoMarketAddress = null;
    
            /**
             * PerpMarketTask driftMarketAddress.
             * @member {string|null|undefined} driftMarketAddress
             * @memberof OracleJob.PerpMarketTask
             * @instance
             */
            PerpMarketTask.prototype.driftMarketAddress = null;
    
            /**
             * PerpMarketTask zetaMarketAddress.
             * @member {string|null|undefined} zetaMarketAddress
             * @memberof OracleJob.PerpMarketTask
             * @instance
             */
            PerpMarketTask.prototype.zetaMarketAddress = null;
    
            /**
             * PerpMarketTask zoMarketAddress.
             * @member {string|null|undefined} zoMarketAddress
             * @memberof OracleJob.PerpMarketTask
             * @instance
             */
            PerpMarketTask.prototype.zoMarketAddress = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * PerpMarketTask MarketAddress.
             * @member {"mangoMarketAddress"|"driftMarketAddress"|"zetaMarketAddress"|"zoMarketAddress"|undefined} MarketAddress
             * @memberof OracleJob.PerpMarketTask
             * @instance
             */
            Object.defineProperty(PerpMarketTask.prototype, "MarketAddress", {
                get: $util.oneOfGetter($oneOfFields = ["mangoMarketAddress", "driftMarketAddress", "zetaMarketAddress", "zoMarketAddress"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new PerpMarketTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {OracleJob.IPerpMarketTask=} [properties] Properties to set
             * @returns {OracleJob.PerpMarketTask} PerpMarketTask instance
             */
            PerpMarketTask.create = function create(properties) {
                return new PerpMarketTask(properties);
            };
    
            /**
             * Encodes the specified PerpMarketTask message. Does not implicitly {@link OracleJob.PerpMarketTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {OracleJob.IPerpMarketTask} message PerpMarketTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PerpMarketTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.mangoMarketAddress != null && Object.hasOwnProperty.call(message, "mangoMarketAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.mangoMarketAddress);
                if (message.driftMarketAddress != null && Object.hasOwnProperty.call(message, "driftMarketAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.driftMarketAddress);
                if (message.zetaMarketAddress != null && Object.hasOwnProperty.call(message, "zetaMarketAddress"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.zetaMarketAddress);
                if (message.zoMarketAddress != null && Object.hasOwnProperty.call(message, "zoMarketAddress"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.zoMarketAddress);
                return writer;
            };
    
            /**
             * Encodes the specified PerpMarketTask message, length delimited. Does not implicitly {@link OracleJob.PerpMarketTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {OracleJob.IPerpMarketTask} message PerpMarketTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PerpMarketTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a PerpMarketTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.PerpMarketTask} PerpMarketTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PerpMarketTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.PerpMarketTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.mangoMarketAddress = reader.string();
                        break;
                    case 2:
                        message.driftMarketAddress = reader.string();
                        break;
                    case 3:
                        message.zetaMarketAddress = reader.string();
                        break;
                    case 4:
                        message.zoMarketAddress = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a PerpMarketTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.PerpMarketTask} PerpMarketTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PerpMarketTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a PerpMarketTask message.
             * @function verify
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PerpMarketTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.mangoMarketAddress != null && message.hasOwnProperty("mangoMarketAddress")) {
                    properties.MarketAddress = 1;
                    if (!$util.isString(message.mangoMarketAddress))
                        return "mangoMarketAddress: string expected";
                }
                if (message.driftMarketAddress != null && message.hasOwnProperty("driftMarketAddress")) {
                    if (properties.MarketAddress === 1)
                        return "MarketAddress: multiple values";
                    properties.MarketAddress = 1;
                    if (!$util.isString(message.driftMarketAddress))
                        return "driftMarketAddress: string expected";
                }
                if (message.zetaMarketAddress != null && message.hasOwnProperty("zetaMarketAddress")) {
                    if (properties.MarketAddress === 1)
                        return "MarketAddress: multiple values";
                    properties.MarketAddress = 1;
                    if (!$util.isString(message.zetaMarketAddress))
                        return "zetaMarketAddress: string expected";
                }
                if (message.zoMarketAddress != null && message.hasOwnProperty("zoMarketAddress")) {
                    if (properties.MarketAddress === 1)
                        return "MarketAddress: multiple values";
                    properties.MarketAddress = 1;
                    if (!$util.isString(message.zoMarketAddress))
                        return "zoMarketAddress: string expected";
                }
                return null;
            };
    
            /**
             * Creates a PerpMarketTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.PerpMarketTask} PerpMarketTask
             */
            PerpMarketTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.PerpMarketTask)
                    return object;
                var message = new $root.OracleJob.PerpMarketTask();
                if (object.mangoMarketAddress != null)
                    message.mangoMarketAddress = String(object.mangoMarketAddress);
                if (object.driftMarketAddress != null)
                    message.driftMarketAddress = String(object.driftMarketAddress);
                if (object.zetaMarketAddress != null)
                    message.zetaMarketAddress = String(object.zetaMarketAddress);
                if (object.zoMarketAddress != null)
                    message.zoMarketAddress = String(object.zoMarketAddress);
                return message;
            };
    
            /**
             * Creates a plain object from a PerpMarketTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {OracleJob.PerpMarketTask} message PerpMarketTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PerpMarketTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.mangoMarketAddress != null && message.hasOwnProperty("mangoMarketAddress")) {
                    object.mangoMarketAddress = message.mangoMarketAddress;
                    if (options.oneofs)
                        object.MarketAddress = "mangoMarketAddress";
                }
                if (message.driftMarketAddress != null && message.hasOwnProperty("driftMarketAddress")) {
                    object.driftMarketAddress = message.driftMarketAddress;
                    if (options.oneofs)
                        object.MarketAddress = "driftMarketAddress";
                }
                if (message.zetaMarketAddress != null && message.hasOwnProperty("zetaMarketAddress")) {
                    object.zetaMarketAddress = message.zetaMarketAddress;
                    if (options.oneofs)
                        object.MarketAddress = "zetaMarketAddress";
                }
                if (message.zoMarketAddress != null && message.hasOwnProperty("zoMarketAddress")) {
                    object.zoMarketAddress = message.zoMarketAddress;
                    if (options.oneofs)
                        object.MarketAddress = "zoMarketAddress";
                }
                return object;
            };
    
            /**
             * Converts this PerpMarketTask to JSON.
             * @function toJSON
             * @memberof OracleJob.PerpMarketTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PerpMarketTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return PerpMarketTask;
        })();
    
        OracleJob.OracleTask = (function() {
    
            /**
             * Properties of an OracleTask.
             * @memberof OracleJob
             * @interface IOracleTask
             * @property {string|null} [switchboardAddress] OracleTask switchboardAddress
             * @property {string|null} [pythAddress] OracleTask pythAddress
             * @property {string|null} [chainlinkAddress] OracleTask chainlinkAddress
             * @property {number|null} [pythAllowedConfidenceInterval] OracleTask pythAllowedConfidenceInterval
             */
    
            /**
             * Constructs a new OracleTask.
             * @memberof OracleJob
             * @classdesc Represents an OracleTask.
             * @implements IOracleTask
             * @constructor
             * @param {OracleJob.IOracleTask=} [properties] Properties to set
             */
            function OracleTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * OracleTask switchboardAddress.
             * @member {string|null|undefined} switchboardAddress
             * @memberof OracleJob.OracleTask
             * @instance
             */
            OracleTask.prototype.switchboardAddress = null;
    
            /**
             * OracleTask pythAddress.
             * @member {string|null|undefined} pythAddress
             * @memberof OracleJob.OracleTask
             * @instance
             */
            OracleTask.prototype.pythAddress = null;
    
            /**
             * OracleTask chainlinkAddress.
             * @member {string|null|undefined} chainlinkAddress
             * @memberof OracleJob.OracleTask
             * @instance
             */
            OracleTask.prototype.chainlinkAddress = null;
    
            /**
             * OracleTask pythAllowedConfidenceInterval.
             * @member {number} pythAllowedConfidenceInterval
             * @memberof OracleJob.OracleTask
             * @instance
             */
            OracleTask.prototype.pythAllowedConfidenceInterval = 0;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * OracleTask AggregatorAddress.
             * @member {"switchboardAddress"|"pythAddress"|"chainlinkAddress"|undefined} AggregatorAddress
             * @memberof OracleJob.OracleTask
             * @instance
             */
            Object.defineProperty(OracleTask.prototype, "AggregatorAddress", {
                get: $util.oneOfGetter($oneOfFields = ["switchboardAddress", "pythAddress", "chainlinkAddress"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new OracleTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.OracleTask
             * @static
             * @param {OracleJob.IOracleTask=} [properties] Properties to set
             * @returns {OracleJob.OracleTask} OracleTask instance
             */
            OracleTask.create = function create(properties) {
                return new OracleTask(properties);
            };
    
            /**
             * Encodes the specified OracleTask message. Does not implicitly {@link OracleJob.OracleTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.OracleTask
             * @static
             * @param {OracleJob.IOracleTask} message OracleTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OracleTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.switchboardAddress != null && Object.hasOwnProperty.call(message, "switchboardAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.switchboardAddress);
                if (message.pythAddress != null && Object.hasOwnProperty.call(message, "pythAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.pythAddress);
                if (message.chainlinkAddress != null && Object.hasOwnProperty.call(message, "chainlinkAddress"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.chainlinkAddress);
                if (message.pythAllowedConfidenceInterval != null && Object.hasOwnProperty.call(message, "pythAllowedConfidenceInterval"))
                    writer.uint32(/* id 4, wireType 1 =*/33).double(message.pythAllowedConfidenceInterval);
                return writer;
            };
    
            /**
             * Encodes the specified OracleTask message, length delimited. Does not implicitly {@link OracleJob.OracleTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.OracleTask
             * @static
             * @param {OracleJob.IOracleTask} message OracleTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OracleTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an OracleTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.OracleTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.OracleTask} OracleTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OracleTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.OracleTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.switchboardAddress = reader.string();
                        break;
                    case 2:
                        message.pythAddress = reader.string();
                        break;
                    case 3:
                        message.chainlinkAddress = reader.string();
                        break;
                    case 4:
                        message.pythAllowedConfidenceInterval = reader.double();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an OracleTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.OracleTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.OracleTask} OracleTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OracleTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an OracleTask message.
             * @function verify
             * @memberof OracleJob.OracleTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            OracleTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.switchboardAddress != null && message.hasOwnProperty("switchboardAddress")) {
                    properties.AggregatorAddress = 1;
                    if (!$util.isString(message.switchboardAddress))
                        return "switchboardAddress: string expected";
                }
                if (message.pythAddress != null && message.hasOwnProperty("pythAddress")) {
                    if (properties.AggregatorAddress === 1)
                        return "AggregatorAddress: multiple values";
                    properties.AggregatorAddress = 1;
                    if (!$util.isString(message.pythAddress))
                        return "pythAddress: string expected";
                }
                if (message.chainlinkAddress != null && message.hasOwnProperty("chainlinkAddress")) {
                    if (properties.AggregatorAddress === 1)
                        return "AggregatorAddress: multiple values";
                    properties.AggregatorAddress = 1;
                    if (!$util.isString(message.chainlinkAddress))
                        return "chainlinkAddress: string expected";
                }
                if (message.pythAllowedConfidenceInterval != null && message.hasOwnProperty("pythAllowedConfidenceInterval"))
                    if (typeof message.pythAllowedConfidenceInterval !== "number")
                        return "pythAllowedConfidenceInterval: number expected";
                return null;
            };
    
            /**
             * Creates an OracleTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.OracleTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.OracleTask} OracleTask
             */
            OracleTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.OracleTask)
                    return object;
                var message = new $root.OracleJob.OracleTask();
                if (object.switchboardAddress != null)
                    message.switchboardAddress = String(object.switchboardAddress);
                if (object.pythAddress != null)
                    message.pythAddress = String(object.pythAddress);
                if (object.chainlinkAddress != null)
                    message.chainlinkAddress = String(object.chainlinkAddress);
                if (object.pythAllowedConfidenceInterval != null)
                    message.pythAllowedConfidenceInterval = Number(object.pythAllowedConfidenceInterval);
                return message;
            };
    
            /**
             * Creates a plain object from an OracleTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.OracleTask
             * @static
             * @param {OracleJob.OracleTask} message OracleTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            OracleTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.pythAllowedConfidenceInterval = 0;
                if (message.switchboardAddress != null && message.hasOwnProperty("switchboardAddress")) {
                    object.switchboardAddress = message.switchboardAddress;
                    if (options.oneofs)
                        object.AggregatorAddress = "switchboardAddress";
                }
                if (message.pythAddress != null && message.hasOwnProperty("pythAddress")) {
                    object.pythAddress = message.pythAddress;
                    if (options.oneofs)
                        object.AggregatorAddress = "pythAddress";
                }
                if (message.chainlinkAddress != null && message.hasOwnProperty("chainlinkAddress")) {
                    object.chainlinkAddress = message.chainlinkAddress;
                    if (options.oneofs)
                        object.AggregatorAddress = "chainlinkAddress";
                }
                if (message.pythAllowedConfidenceInterval != null && message.hasOwnProperty("pythAllowedConfidenceInterval"))
                    object.pythAllowedConfidenceInterval = options.json && !isFinite(message.pythAllowedConfidenceInterval) ? String(message.pythAllowedConfidenceInterval) : message.pythAllowedConfidenceInterval;
                return object;
            };
    
            /**
             * Converts this OracleTask to JSON.
             * @function toJSON
             * @memberof OracleJob.OracleTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            OracleTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return OracleTask;
        })();
    
        OracleJob.AnchorFetchTask = (function() {
    
            /**
             * Properties of an AnchorFetchTask.
             * @memberof OracleJob
             * @interface IAnchorFetchTask
             * @property {string|null} [programId] AnchorFetchTask programId
             * @property {string|null} [accountAddress] AnchorFetchTask accountAddress
             */
    
            /**
             * Constructs a new AnchorFetchTask.
             * @memberof OracleJob
             * @classdesc Represents an AnchorFetchTask.
             * @implements IAnchorFetchTask
             * @constructor
             * @param {OracleJob.IAnchorFetchTask=} [properties] Properties to set
             */
            function AnchorFetchTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * AnchorFetchTask programId.
             * @member {string} programId
             * @memberof OracleJob.AnchorFetchTask
             * @instance
             */
            AnchorFetchTask.prototype.programId = "";
    
            /**
             * AnchorFetchTask accountAddress.
             * @member {string} accountAddress
             * @memberof OracleJob.AnchorFetchTask
             * @instance
             */
            AnchorFetchTask.prototype.accountAddress = "";
    
            /**
             * Creates a new AnchorFetchTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {OracleJob.IAnchorFetchTask=} [properties] Properties to set
             * @returns {OracleJob.AnchorFetchTask} AnchorFetchTask instance
             */
            AnchorFetchTask.create = function create(properties) {
                return new AnchorFetchTask(properties);
            };
    
            /**
             * Encodes the specified AnchorFetchTask message. Does not implicitly {@link OracleJob.AnchorFetchTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {OracleJob.IAnchorFetchTask} message AnchorFetchTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AnchorFetchTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.programId != null && Object.hasOwnProperty.call(message, "programId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.programId);
                if (message.accountAddress != null && Object.hasOwnProperty.call(message, "accountAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.accountAddress);
                return writer;
            };
    
            /**
             * Encodes the specified AnchorFetchTask message, length delimited. Does not implicitly {@link OracleJob.AnchorFetchTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {OracleJob.IAnchorFetchTask} message AnchorFetchTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AnchorFetchTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an AnchorFetchTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.AnchorFetchTask} AnchorFetchTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AnchorFetchTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.AnchorFetchTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.programId = reader.string();
                        break;
                    case 2:
                        message.accountAddress = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an AnchorFetchTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.AnchorFetchTask} AnchorFetchTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AnchorFetchTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an AnchorFetchTask message.
             * @function verify
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AnchorFetchTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.programId != null && message.hasOwnProperty("programId"))
                    if (!$util.isString(message.programId))
                        return "programId: string expected";
                if (message.accountAddress != null && message.hasOwnProperty("accountAddress"))
                    if (!$util.isString(message.accountAddress))
                        return "accountAddress: string expected";
                return null;
            };
    
            /**
             * Creates an AnchorFetchTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.AnchorFetchTask} AnchorFetchTask
             */
            AnchorFetchTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.AnchorFetchTask)
                    return object;
                var message = new $root.OracleJob.AnchorFetchTask();
                if (object.programId != null)
                    message.programId = String(object.programId);
                if (object.accountAddress != null)
                    message.accountAddress = String(object.accountAddress);
                return message;
            };
    
            /**
             * Creates a plain object from an AnchorFetchTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {OracleJob.AnchorFetchTask} message AnchorFetchTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AnchorFetchTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.programId = "";
                    object.accountAddress = "";
                }
                if (message.programId != null && message.hasOwnProperty("programId"))
                    object.programId = message.programId;
                if (message.accountAddress != null && message.hasOwnProperty("accountAddress"))
                    object.accountAddress = message.accountAddress;
                return object;
            };
    
            /**
             * Converts this AnchorFetchTask to JSON.
             * @function toJSON
             * @memberof OracleJob.AnchorFetchTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AnchorFetchTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return AnchorFetchTask;
        })();
    
        OracleJob.TpsTask = (function() {
    
            /**
             * Properties of a TpsTask.
             * @memberof OracleJob
             * @interface ITpsTask
             */
    
            /**
             * Constructs a new TpsTask.
             * @memberof OracleJob
             * @classdesc Represents a TpsTask.
             * @implements ITpsTask
             * @constructor
             * @param {OracleJob.ITpsTask=} [properties] Properties to set
             */
            function TpsTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Creates a new TpsTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.TpsTask
             * @static
             * @param {OracleJob.ITpsTask=} [properties] Properties to set
             * @returns {OracleJob.TpsTask} TpsTask instance
             */
            TpsTask.create = function create(properties) {
                return new TpsTask(properties);
            };
    
            /**
             * Encodes the specified TpsTask message. Does not implicitly {@link OracleJob.TpsTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.TpsTask
             * @static
             * @param {OracleJob.ITpsTask} message TpsTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TpsTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };
    
            /**
             * Encodes the specified TpsTask message, length delimited. Does not implicitly {@link OracleJob.TpsTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.TpsTask
             * @static
             * @param {OracleJob.ITpsTask} message TpsTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TpsTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a TpsTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.TpsTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.TpsTask} TpsTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TpsTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.TpsTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a TpsTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.TpsTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.TpsTask} TpsTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TpsTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a TpsTask message.
             * @function verify
             * @memberof OracleJob.TpsTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TpsTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };
    
            /**
             * Creates a TpsTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.TpsTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.TpsTask} TpsTask
             */
            TpsTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.TpsTask)
                    return object;
                return new $root.OracleJob.TpsTask();
            };
    
            /**
             * Creates a plain object from a TpsTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.TpsTask
             * @static
             * @param {OracleJob.TpsTask} message TpsTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TpsTask.toObject = function toObject() {
                return {};
            };
    
            /**
             * Converts this TpsTask to JSON.
             * @function toJSON
             * @memberof OracleJob.TpsTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TpsTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return TpsTask;
        })();
    
        OracleJob.SplStakePoolTask = (function() {
    
            /**
             * Properties of a SplStakePoolTask.
             * @memberof OracleJob
             * @interface ISplStakePoolTask
             * @property {string|null} [pubkey] SplStakePoolTask pubkey
             */
    
            /**
             * Constructs a new SplStakePoolTask.
             * @memberof OracleJob
             * @classdesc Represents a SplStakePoolTask.
             * @implements ISplStakePoolTask
             * @constructor
             * @param {OracleJob.ISplStakePoolTask=} [properties] Properties to set
             */
            function SplStakePoolTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SplStakePoolTask pubkey.
             * @member {string} pubkey
             * @memberof OracleJob.SplStakePoolTask
             * @instance
             */
            SplStakePoolTask.prototype.pubkey = "";
    
            /**
             * Creates a new SplStakePoolTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {OracleJob.ISplStakePoolTask=} [properties] Properties to set
             * @returns {OracleJob.SplStakePoolTask} SplStakePoolTask instance
             */
            SplStakePoolTask.create = function create(properties) {
                return new SplStakePoolTask(properties);
            };
    
            /**
             * Encodes the specified SplStakePoolTask message. Does not implicitly {@link OracleJob.SplStakePoolTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {OracleJob.ISplStakePoolTask} message SplStakePoolTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SplStakePoolTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.pubkey != null && Object.hasOwnProperty.call(message, "pubkey"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.pubkey);
                return writer;
            };
    
            /**
             * Encodes the specified SplStakePoolTask message, length delimited. Does not implicitly {@link OracleJob.SplStakePoolTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {OracleJob.ISplStakePoolTask} message SplStakePoolTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SplStakePoolTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SplStakePoolTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.SplStakePoolTask} SplStakePoolTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SplStakePoolTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.SplStakePoolTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.pubkey = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SplStakePoolTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.SplStakePoolTask} SplStakePoolTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SplStakePoolTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SplStakePoolTask message.
             * @function verify
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SplStakePoolTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.pubkey != null && message.hasOwnProperty("pubkey"))
                    if (!$util.isString(message.pubkey))
                        return "pubkey: string expected";
                return null;
            };
    
            /**
             * Creates a SplStakePoolTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.SplStakePoolTask} SplStakePoolTask
             */
            SplStakePoolTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.SplStakePoolTask)
                    return object;
                var message = new $root.OracleJob.SplStakePoolTask();
                if (object.pubkey != null)
                    message.pubkey = String(object.pubkey);
                return message;
            };
    
            /**
             * Creates a plain object from a SplStakePoolTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {OracleJob.SplStakePoolTask} message SplStakePoolTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SplStakePoolTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.pubkey = "";
                if (message.pubkey != null && message.hasOwnProperty("pubkey"))
                    object.pubkey = message.pubkey;
                return object;
            };
    
            /**
             * Converts this SplStakePoolTask to JSON.
             * @function toJSON
             * @memberof OracleJob.SplStakePoolTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SplStakePoolTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SplStakePoolTask;
        })();
    
        OracleJob.SplTokenParseTask = (function() {
    
            /**
             * Properties of a SplTokenParseTask.
             * @memberof OracleJob
             * @interface ISplTokenParseTask
             * @property {string|null} [tokenAccountAddress] SplTokenParseTask tokenAccountAddress
             * @property {string|null} [mintAddress] SplTokenParseTask mintAddress
             */
    
            /**
             * Constructs a new SplTokenParseTask.
             * @memberof OracleJob
             * @classdesc Represents a SplTokenParseTask.
             * @implements ISplTokenParseTask
             * @constructor
             * @param {OracleJob.ISplTokenParseTask=} [properties] Properties to set
             */
            function SplTokenParseTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SplTokenParseTask tokenAccountAddress.
             * @member {string|null|undefined} tokenAccountAddress
             * @memberof OracleJob.SplTokenParseTask
             * @instance
             */
            SplTokenParseTask.prototype.tokenAccountAddress = null;
    
            /**
             * SplTokenParseTask mintAddress.
             * @member {string|null|undefined} mintAddress
             * @memberof OracleJob.SplTokenParseTask
             * @instance
             */
            SplTokenParseTask.prototype.mintAddress = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * SplTokenParseTask AccountAddress.
             * @member {"tokenAccountAddress"|"mintAddress"|undefined} AccountAddress
             * @memberof OracleJob.SplTokenParseTask
             * @instance
             */
            Object.defineProperty(SplTokenParseTask.prototype, "AccountAddress", {
                get: $util.oneOfGetter($oneOfFields = ["tokenAccountAddress", "mintAddress"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new SplTokenParseTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {OracleJob.ISplTokenParseTask=} [properties] Properties to set
             * @returns {OracleJob.SplTokenParseTask} SplTokenParseTask instance
             */
            SplTokenParseTask.create = function create(properties) {
                return new SplTokenParseTask(properties);
            };
    
            /**
             * Encodes the specified SplTokenParseTask message. Does not implicitly {@link OracleJob.SplTokenParseTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {OracleJob.ISplTokenParseTask} message SplTokenParseTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SplTokenParseTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.tokenAccountAddress != null && Object.hasOwnProperty.call(message, "tokenAccountAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.tokenAccountAddress);
                if (message.mintAddress != null && Object.hasOwnProperty.call(message, "mintAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.mintAddress);
                return writer;
            };
    
            /**
             * Encodes the specified SplTokenParseTask message, length delimited. Does not implicitly {@link OracleJob.SplTokenParseTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {OracleJob.ISplTokenParseTask} message SplTokenParseTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SplTokenParseTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SplTokenParseTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.SplTokenParseTask} SplTokenParseTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SplTokenParseTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.SplTokenParseTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.tokenAccountAddress = reader.string();
                        break;
                    case 2:
                        message.mintAddress = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SplTokenParseTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.SplTokenParseTask} SplTokenParseTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SplTokenParseTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SplTokenParseTask message.
             * @function verify
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SplTokenParseTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.tokenAccountAddress != null && message.hasOwnProperty("tokenAccountAddress")) {
                    properties.AccountAddress = 1;
                    if (!$util.isString(message.tokenAccountAddress))
                        return "tokenAccountAddress: string expected";
                }
                if (message.mintAddress != null && message.hasOwnProperty("mintAddress")) {
                    if (properties.AccountAddress === 1)
                        return "AccountAddress: multiple values";
                    properties.AccountAddress = 1;
                    if (!$util.isString(message.mintAddress))
                        return "mintAddress: string expected";
                }
                return null;
            };
    
            /**
             * Creates a SplTokenParseTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.SplTokenParseTask} SplTokenParseTask
             */
            SplTokenParseTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.SplTokenParseTask)
                    return object;
                var message = new $root.OracleJob.SplTokenParseTask();
                if (object.tokenAccountAddress != null)
                    message.tokenAccountAddress = String(object.tokenAccountAddress);
                if (object.mintAddress != null)
                    message.mintAddress = String(object.mintAddress);
                return message;
            };
    
            /**
             * Creates a plain object from a SplTokenParseTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {OracleJob.SplTokenParseTask} message SplTokenParseTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SplTokenParseTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.tokenAccountAddress != null && message.hasOwnProperty("tokenAccountAddress")) {
                    object.tokenAccountAddress = message.tokenAccountAddress;
                    if (options.oneofs)
                        object.AccountAddress = "tokenAccountAddress";
                }
                if (message.mintAddress != null && message.hasOwnProperty("mintAddress")) {
                    object.mintAddress = message.mintAddress;
                    if (options.oneofs)
                        object.AccountAddress = "mintAddress";
                }
                return object;
            };
    
            /**
             * Converts this SplTokenParseTask to JSON.
             * @function toJSON
             * @memberof OracleJob.SplTokenParseTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SplTokenParseTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SplTokenParseTask;
        })();
    
        OracleJob.DefiKingdomsTask = (function() {
    
            /**
             * Properties of a DefiKingdomsTask.
             * @memberof OracleJob
             * @interface IDefiKingdomsTask
             * @property {string|null} [provider] DefiKingdomsTask provider
             * @property {OracleJob.DefiKingdomsTask.IToken|null} [inToken] DefiKingdomsTask inToken
             * @property {OracleJob.DefiKingdomsTask.IToken|null} [outToken] DefiKingdomsTask outToken
             */
    
            /**
             * Constructs a new DefiKingdomsTask.
             * @memberof OracleJob
             * @classdesc Represents a DefiKingdomsTask.
             * @implements IDefiKingdomsTask
             * @constructor
             * @param {OracleJob.IDefiKingdomsTask=} [properties] Properties to set
             */
            function DefiKingdomsTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * DefiKingdomsTask provider.
             * @member {string} provider
             * @memberof OracleJob.DefiKingdomsTask
             * @instance
             */
            DefiKingdomsTask.prototype.provider = "";
    
            /**
             * DefiKingdomsTask inToken.
             * @member {OracleJob.DefiKingdomsTask.IToken|null|undefined} inToken
             * @memberof OracleJob.DefiKingdomsTask
             * @instance
             */
            DefiKingdomsTask.prototype.inToken = null;
    
            /**
             * DefiKingdomsTask outToken.
             * @member {OracleJob.DefiKingdomsTask.IToken|null|undefined} outToken
             * @memberof OracleJob.DefiKingdomsTask
             * @instance
             */
            DefiKingdomsTask.prototype.outToken = null;
    
            /**
             * Creates a new DefiKingdomsTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {OracleJob.IDefiKingdomsTask=} [properties] Properties to set
             * @returns {OracleJob.DefiKingdomsTask} DefiKingdomsTask instance
             */
            DefiKingdomsTask.create = function create(properties) {
                return new DefiKingdomsTask(properties);
            };
    
            /**
             * Encodes the specified DefiKingdomsTask message. Does not implicitly {@link OracleJob.DefiKingdomsTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {OracleJob.IDefiKingdomsTask} message DefiKingdomsTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DefiKingdomsTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.provider != null && Object.hasOwnProperty.call(message, "provider"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.provider);
                if (message.inToken != null && Object.hasOwnProperty.call(message, "inToken"))
                    $root.OracleJob.DefiKingdomsTask.Token.encode(message.inToken, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.outToken != null && Object.hasOwnProperty.call(message, "outToken"))
                    $root.OracleJob.DefiKingdomsTask.Token.encode(message.outToken, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified DefiKingdomsTask message, length delimited. Does not implicitly {@link OracleJob.DefiKingdomsTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {OracleJob.IDefiKingdomsTask} message DefiKingdomsTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DefiKingdomsTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a DefiKingdomsTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.DefiKingdomsTask} DefiKingdomsTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DefiKingdomsTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.DefiKingdomsTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.provider = reader.string();
                        break;
                    case 2:
                        message.inToken = $root.OracleJob.DefiKingdomsTask.Token.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.outToken = $root.OracleJob.DefiKingdomsTask.Token.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a DefiKingdomsTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.DefiKingdomsTask} DefiKingdomsTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DefiKingdomsTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a DefiKingdomsTask message.
             * @function verify
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DefiKingdomsTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.provider != null && message.hasOwnProperty("provider"))
                    if (!$util.isString(message.provider))
                        return "provider: string expected";
                if (message.inToken != null && message.hasOwnProperty("inToken")) {
                    var error = $root.OracleJob.DefiKingdomsTask.Token.verify(message.inToken);
                    if (error)
                        return "inToken." + error;
                }
                if (message.outToken != null && message.hasOwnProperty("outToken")) {
                    var error = $root.OracleJob.DefiKingdomsTask.Token.verify(message.outToken);
                    if (error)
                        return "outToken." + error;
                }
                return null;
            };
    
            /**
             * Creates a DefiKingdomsTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.DefiKingdomsTask} DefiKingdomsTask
             */
            DefiKingdomsTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.DefiKingdomsTask)
                    return object;
                var message = new $root.OracleJob.DefiKingdomsTask();
                if (object.provider != null)
                    message.provider = String(object.provider);
                if (object.inToken != null) {
                    if (typeof object.inToken !== "object")
                        throw TypeError(".OracleJob.DefiKingdomsTask.inToken: object expected");
                    message.inToken = $root.OracleJob.DefiKingdomsTask.Token.fromObject(object.inToken);
                }
                if (object.outToken != null) {
                    if (typeof object.outToken !== "object")
                        throw TypeError(".OracleJob.DefiKingdomsTask.outToken: object expected");
                    message.outToken = $root.OracleJob.DefiKingdomsTask.Token.fromObject(object.outToken);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a DefiKingdomsTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {OracleJob.DefiKingdomsTask} message DefiKingdomsTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DefiKingdomsTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.provider = "";
                    object.inToken = null;
                    object.outToken = null;
                }
                if (message.provider != null && message.hasOwnProperty("provider"))
                    object.provider = message.provider;
                if (message.inToken != null && message.hasOwnProperty("inToken"))
                    object.inToken = $root.OracleJob.DefiKingdomsTask.Token.toObject(message.inToken, options);
                if (message.outToken != null && message.hasOwnProperty("outToken"))
                    object.outToken = $root.OracleJob.DefiKingdomsTask.Token.toObject(message.outToken, options);
                return object;
            };
    
            /**
             * Converts this DefiKingdomsTask to JSON.
             * @function toJSON
             * @memberof OracleJob.DefiKingdomsTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DefiKingdomsTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            DefiKingdomsTask.Token = (function() {
    
                /**
                 * Properties of a Token.
                 * @memberof OracleJob.DefiKingdomsTask
                 * @interface IToken
                 * @property {string|null} [address] Token address
                 * @property {number|null} [decimals] Token decimals
                 */
    
                /**
                 * Constructs a new Token.
                 * @memberof OracleJob.DefiKingdomsTask
                 * @classdesc Represents a Token.
                 * @implements IToken
                 * @constructor
                 * @param {OracleJob.DefiKingdomsTask.IToken=} [properties] Properties to set
                 */
                function Token(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Token address.
                 * @member {string} address
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @instance
                 */
                Token.prototype.address = "";
    
                /**
                 * Token decimals.
                 * @member {number} decimals
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @instance
                 */
                Token.prototype.decimals = 0;
    
                /**
                 * Creates a new Token instance using the specified properties.
                 * @function create
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {OracleJob.DefiKingdomsTask.IToken=} [properties] Properties to set
                 * @returns {OracleJob.DefiKingdomsTask.Token} Token instance
                 */
                Token.create = function create(properties) {
                    return new Token(properties);
                };
    
                /**
                 * Encodes the specified Token message. Does not implicitly {@link OracleJob.DefiKingdomsTask.Token.verify|verify} messages.
                 * @function encode
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {OracleJob.DefiKingdomsTask.IToken} message Token message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Token.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.address != null && Object.hasOwnProperty.call(message, "address"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.address);
                    if (message.decimals != null && Object.hasOwnProperty.call(message, "decimals"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.decimals);
                    return writer;
                };
    
                /**
                 * Encodes the specified Token message, length delimited. Does not implicitly {@link OracleJob.DefiKingdomsTask.Token.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {OracleJob.DefiKingdomsTask.IToken} message Token message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Token.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Token message from the specified reader or buffer.
                 * @function decode
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {OracleJob.DefiKingdomsTask.Token} Token
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Token.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.DefiKingdomsTask.Token();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.address = reader.string();
                            break;
                        case 2:
                            message.decimals = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Token message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {OracleJob.DefiKingdomsTask.Token} Token
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Token.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Token message.
                 * @function verify
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Token.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.address != null && message.hasOwnProperty("address"))
                        if (!$util.isString(message.address))
                            return "address: string expected";
                    if (message.decimals != null && message.hasOwnProperty("decimals"))
                        if (!$util.isInteger(message.decimals))
                            return "decimals: integer expected";
                    return null;
                };
    
                /**
                 * Creates a Token message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {OracleJob.DefiKingdomsTask.Token} Token
                 */
                Token.fromObject = function fromObject(object) {
                    if (object instanceof $root.OracleJob.DefiKingdomsTask.Token)
                        return object;
                    var message = new $root.OracleJob.DefiKingdomsTask.Token();
                    if (object.address != null)
                        message.address = String(object.address);
                    if (object.decimals != null)
                        message.decimals = object.decimals | 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from a Token message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {OracleJob.DefiKingdomsTask.Token} message Token
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Token.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.address = "";
                        object.decimals = 0;
                    }
                    if (message.address != null && message.hasOwnProperty("address"))
                        object.address = message.address;
                    if (message.decimals != null && message.hasOwnProperty("decimals"))
                        object.decimals = message.decimals;
                    return object;
                };
    
                /**
                 * Converts this Token to JSON.
                 * @function toJSON
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Token.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Token;
            })();
    
            return DefiKingdomsTask;
        })();
    
        OracleJob.UniswapExchangeRateTask = (function() {
    
            /**
             * Properties of an UniswapExchangeRateTask.
             * @memberof OracleJob
             * @interface IUniswapExchangeRateTask
             * @property {string|null} [inTokenAddress] UniswapExchangeRateTask inTokenAddress
             * @property {string|null} [outTokenAddress] UniswapExchangeRateTask outTokenAddress
             * @property {number|null} [inTokenAmount] UniswapExchangeRateTask inTokenAmount
             * @property {number|null} [slippage] UniswapExchangeRateTask slippage
             * @property {string|null} [provider] UniswapExchangeRateTask provider
             */
    
            /**
             * Constructs a new UniswapExchangeRateTask.
             * @memberof OracleJob
             * @classdesc Represents an UniswapExchangeRateTask.
             * @implements IUniswapExchangeRateTask
             * @constructor
             * @param {OracleJob.IUniswapExchangeRateTask=} [properties] Properties to set
             */
            function UniswapExchangeRateTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * UniswapExchangeRateTask inTokenAddress.
             * @member {string} inTokenAddress
             * @memberof OracleJob.UniswapExchangeRateTask
             * @instance
             */
            UniswapExchangeRateTask.prototype.inTokenAddress = "";
    
            /**
             * UniswapExchangeRateTask outTokenAddress.
             * @member {string} outTokenAddress
             * @memberof OracleJob.UniswapExchangeRateTask
             * @instance
             */
            UniswapExchangeRateTask.prototype.outTokenAddress = "";
    
            /**
             * UniswapExchangeRateTask inTokenAmount.
             * @member {number} inTokenAmount
             * @memberof OracleJob.UniswapExchangeRateTask
             * @instance
             */
            UniswapExchangeRateTask.prototype.inTokenAmount = 0;
    
            /**
             * UniswapExchangeRateTask slippage.
             * @member {number} slippage
             * @memberof OracleJob.UniswapExchangeRateTask
             * @instance
             */
            UniswapExchangeRateTask.prototype.slippage = 0;
    
            /**
             * UniswapExchangeRateTask provider.
             * @member {string} provider
             * @memberof OracleJob.UniswapExchangeRateTask
             * @instance
             */
            UniswapExchangeRateTask.prototype.provider = "";
    
            /**
             * Creates a new UniswapExchangeRateTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {OracleJob.IUniswapExchangeRateTask=} [properties] Properties to set
             * @returns {OracleJob.UniswapExchangeRateTask} UniswapExchangeRateTask instance
             */
            UniswapExchangeRateTask.create = function create(properties) {
                return new UniswapExchangeRateTask(properties);
            };
    
            /**
             * Encodes the specified UniswapExchangeRateTask message. Does not implicitly {@link OracleJob.UniswapExchangeRateTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {OracleJob.IUniswapExchangeRateTask} message UniswapExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UniswapExchangeRateTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.inTokenAddress != null && Object.hasOwnProperty.call(message, "inTokenAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.inTokenAddress);
                if (message.outTokenAddress != null && Object.hasOwnProperty.call(message, "outTokenAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.outTokenAddress);
                if (message.inTokenAmount != null && Object.hasOwnProperty.call(message, "inTokenAmount"))
                    writer.uint32(/* id 3, wireType 1 =*/25).double(message.inTokenAmount);
                if (message.slippage != null && Object.hasOwnProperty.call(message, "slippage"))
                    writer.uint32(/* id 4, wireType 1 =*/33).double(message.slippage);
                if (message.provider != null && Object.hasOwnProperty.call(message, "provider"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.provider);
                return writer;
            };
    
            /**
             * Encodes the specified UniswapExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.UniswapExchangeRateTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {OracleJob.IUniswapExchangeRateTask} message UniswapExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UniswapExchangeRateTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an UniswapExchangeRateTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.UniswapExchangeRateTask} UniswapExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UniswapExchangeRateTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.UniswapExchangeRateTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.inTokenAddress = reader.string();
                        break;
                    case 2:
                        message.outTokenAddress = reader.string();
                        break;
                    case 3:
                        message.inTokenAmount = reader.double();
                        break;
                    case 4:
                        message.slippage = reader.double();
                        break;
                    case 5:
                        message.provider = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an UniswapExchangeRateTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.UniswapExchangeRateTask} UniswapExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UniswapExchangeRateTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an UniswapExchangeRateTask message.
             * @function verify
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UniswapExchangeRateTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    if (!$util.isString(message.inTokenAddress))
                        return "inTokenAddress: string expected";
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    if (!$util.isString(message.outTokenAddress))
                        return "outTokenAddress: string expected";
                if (message.inTokenAmount != null && message.hasOwnProperty("inTokenAmount"))
                    if (typeof message.inTokenAmount !== "number")
                        return "inTokenAmount: number expected";
                if (message.slippage != null && message.hasOwnProperty("slippage"))
                    if (typeof message.slippage !== "number")
                        return "slippage: number expected";
                if (message.provider != null && message.hasOwnProperty("provider"))
                    if (!$util.isString(message.provider))
                        return "provider: string expected";
                return null;
            };
    
            /**
             * Creates an UniswapExchangeRateTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.UniswapExchangeRateTask} UniswapExchangeRateTask
             */
            UniswapExchangeRateTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.UniswapExchangeRateTask)
                    return object;
                var message = new $root.OracleJob.UniswapExchangeRateTask();
                if (object.inTokenAddress != null)
                    message.inTokenAddress = String(object.inTokenAddress);
                if (object.outTokenAddress != null)
                    message.outTokenAddress = String(object.outTokenAddress);
                if (object.inTokenAmount != null)
                    message.inTokenAmount = Number(object.inTokenAmount);
                if (object.slippage != null)
                    message.slippage = Number(object.slippage);
                if (object.provider != null)
                    message.provider = String(object.provider);
                return message;
            };
    
            /**
             * Creates a plain object from an UniswapExchangeRateTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {OracleJob.UniswapExchangeRateTask} message UniswapExchangeRateTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UniswapExchangeRateTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.inTokenAddress = "";
                    object.outTokenAddress = "";
                    object.inTokenAmount = 0;
                    object.slippage = 0;
                    object.provider = "";
                }
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    object.inTokenAddress = message.inTokenAddress;
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    object.outTokenAddress = message.outTokenAddress;
                if (message.inTokenAmount != null && message.hasOwnProperty("inTokenAmount"))
                    object.inTokenAmount = options.json && !isFinite(message.inTokenAmount) ? String(message.inTokenAmount) : message.inTokenAmount;
                if (message.slippage != null && message.hasOwnProperty("slippage"))
                    object.slippage = options.json && !isFinite(message.slippage) ? String(message.slippage) : message.slippage;
                if (message.provider != null && message.hasOwnProperty("provider"))
                    object.provider = message.provider;
                return object;
            };
    
            /**
             * Converts this UniswapExchangeRateTask to JSON.
             * @function toJSON
             * @memberof OracleJob.UniswapExchangeRateTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UniswapExchangeRateTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return UniswapExchangeRateTask;
        })();
    
        OracleJob.SushiswapExchangeRateTask = (function() {
    
            /**
             * Properties of a SushiswapExchangeRateTask.
             * @memberof OracleJob
             * @interface ISushiswapExchangeRateTask
             * @property {string|null} [inTokenAddress] SushiswapExchangeRateTask inTokenAddress
             * @property {string|null} [outTokenAddress] SushiswapExchangeRateTask outTokenAddress
             * @property {number|null} [inTokenAmount] SushiswapExchangeRateTask inTokenAmount
             * @property {number|null} [slippage] SushiswapExchangeRateTask slippage
             * @property {string|null} [provider] SushiswapExchangeRateTask provider
             */
    
            /**
             * Constructs a new SushiswapExchangeRateTask.
             * @memberof OracleJob
             * @classdesc Represents a SushiswapExchangeRateTask.
             * @implements ISushiswapExchangeRateTask
             * @constructor
             * @param {OracleJob.ISushiswapExchangeRateTask=} [properties] Properties to set
             */
            function SushiswapExchangeRateTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SushiswapExchangeRateTask inTokenAddress.
             * @member {string} inTokenAddress
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @instance
             */
            SushiswapExchangeRateTask.prototype.inTokenAddress = "";
    
            /**
             * SushiswapExchangeRateTask outTokenAddress.
             * @member {string} outTokenAddress
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @instance
             */
            SushiswapExchangeRateTask.prototype.outTokenAddress = "";
    
            /**
             * SushiswapExchangeRateTask inTokenAmount.
             * @member {number} inTokenAmount
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @instance
             */
            SushiswapExchangeRateTask.prototype.inTokenAmount = 0;
    
            /**
             * SushiswapExchangeRateTask slippage.
             * @member {number} slippage
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @instance
             */
            SushiswapExchangeRateTask.prototype.slippage = 0;
    
            /**
             * SushiswapExchangeRateTask provider.
             * @member {string} provider
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @instance
             */
            SushiswapExchangeRateTask.prototype.provider = "";
    
            /**
             * Creates a new SushiswapExchangeRateTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {OracleJob.ISushiswapExchangeRateTask=} [properties] Properties to set
             * @returns {OracleJob.SushiswapExchangeRateTask} SushiswapExchangeRateTask instance
             */
            SushiswapExchangeRateTask.create = function create(properties) {
                return new SushiswapExchangeRateTask(properties);
            };
    
            /**
             * Encodes the specified SushiswapExchangeRateTask message. Does not implicitly {@link OracleJob.SushiswapExchangeRateTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {OracleJob.ISushiswapExchangeRateTask} message SushiswapExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SushiswapExchangeRateTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.inTokenAddress != null && Object.hasOwnProperty.call(message, "inTokenAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.inTokenAddress);
                if (message.outTokenAddress != null && Object.hasOwnProperty.call(message, "outTokenAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.outTokenAddress);
                if (message.inTokenAmount != null && Object.hasOwnProperty.call(message, "inTokenAmount"))
                    writer.uint32(/* id 3, wireType 1 =*/25).double(message.inTokenAmount);
                if (message.slippage != null && Object.hasOwnProperty.call(message, "slippage"))
                    writer.uint32(/* id 4, wireType 1 =*/33).double(message.slippage);
                if (message.provider != null && Object.hasOwnProperty.call(message, "provider"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.provider);
                return writer;
            };
    
            /**
             * Encodes the specified SushiswapExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.SushiswapExchangeRateTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {OracleJob.ISushiswapExchangeRateTask} message SushiswapExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SushiswapExchangeRateTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SushiswapExchangeRateTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.SushiswapExchangeRateTask} SushiswapExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SushiswapExchangeRateTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.SushiswapExchangeRateTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.inTokenAddress = reader.string();
                        break;
                    case 2:
                        message.outTokenAddress = reader.string();
                        break;
                    case 3:
                        message.inTokenAmount = reader.double();
                        break;
                    case 4:
                        message.slippage = reader.double();
                        break;
                    case 5:
                        message.provider = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SushiswapExchangeRateTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.SushiswapExchangeRateTask} SushiswapExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SushiswapExchangeRateTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SushiswapExchangeRateTask message.
             * @function verify
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SushiswapExchangeRateTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    if (!$util.isString(message.inTokenAddress))
                        return "inTokenAddress: string expected";
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    if (!$util.isString(message.outTokenAddress))
                        return "outTokenAddress: string expected";
                if (message.inTokenAmount != null && message.hasOwnProperty("inTokenAmount"))
                    if (typeof message.inTokenAmount !== "number")
                        return "inTokenAmount: number expected";
                if (message.slippage != null && message.hasOwnProperty("slippage"))
                    if (typeof message.slippage !== "number")
                        return "slippage: number expected";
                if (message.provider != null && message.hasOwnProperty("provider"))
                    if (!$util.isString(message.provider))
                        return "provider: string expected";
                return null;
            };
    
            /**
             * Creates a SushiswapExchangeRateTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.SushiswapExchangeRateTask} SushiswapExchangeRateTask
             */
            SushiswapExchangeRateTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.SushiswapExchangeRateTask)
                    return object;
                var message = new $root.OracleJob.SushiswapExchangeRateTask();
                if (object.inTokenAddress != null)
                    message.inTokenAddress = String(object.inTokenAddress);
                if (object.outTokenAddress != null)
                    message.outTokenAddress = String(object.outTokenAddress);
                if (object.inTokenAmount != null)
                    message.inTokenAmount = Number(object.inTokenAmount);
                if (object.slippage != null)
                    message.slippage = Number(object.slippage);
                if (object.provider != null)
                    message.provider = String(object.provider);
                return message;
            };
    
            /**
             * Creates a plain object from a SushiswapExchangeRateTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {OracleJob.SushiswapExchangeRateTask} message SushiswapExchangeRateTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SushiswapExchangeRateTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.inTokenAddress = "";
                    object.outTokenAddress = "";
                    object.inTokenAmount = 0;
                    object.slippage = 0;
                    object.provider = "";
                }
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    object.inTokenAddress = message.inTokenAddress;
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    object.outTokenAddress = message.outTokenAddress;
                if (message.inTokenAmount != null && message.hasOwnProperty("inTokenAmount"))
                    object.inTokenAmount = options.json && !isFinite(message.inTokenAmount) ? String(message.inTokenAmount) : message.inTokenAmount;
                if (message.slippage != null && message.hasOwnProperty("slippage"))
                    object.slippage = options.json && !isFinite(message.slippage) ? String(message.slippage) : message.slippage;
                if (message.provider != null && message.hasOwnProperty("provider"))
                    object.provider = message.provider;
                return object;
            };
    
            /**
             * Converts this SushiswapExchangeRateTask to JSON.
             * @function toJSON
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SushiswapExchangeRateTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SushiswapExchangeRateTask;
        })();
    
        OracleJob.PancakeswapExchangeRateTask = (function() {
    
            /**
             * Properties of a PancakeswapExchangeRateTask.
             * @memberof OracleJob
             * @interface IPancakeswapExchangeRateTask
             * @property {string|null} [inTokenAddress] PancakeswapExchangeRateTask inTokenAddress
             * @property {string|null} [outTokenAddress] PancakeswapExchangeRateTask outTokenAddress
             * @property {number|null} [inTokenAmount] PancakeswapExchangeRateTask inTokenAmount
             * @property {number|null} [slippage] PancakeswapExchangeRateTask slippage
             * @property {string|null} [provider] PancakeswapExchangeRateTask provider
             */
    
            /**
             * Constructs a new PancakeswapExchangeRateTask.
             * @memberof OracleJob
             * @classdesc Represents a PancakeswapExchangeRateTask.
             * @implements IPancakeswapExchangeRateTask
             * @constructor
             * @param {OracleJob.IPancakeswapExchangeRateTask=} [properties] Properties to set
             */
            function PancakeswapExchangeRateTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * PancakeswapExchangeRateTask inTokenAddress.
             * @member {string} inTokenAddress
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @instance
             */
            PancakeswapExchangeRateTask.prototype.inTokenAddress = "";
    
            /**
             * PancakeswapExchangeRateTask outTokenAddress.
             * @member {string} outTokenAddress
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @instance
             */
            PancakeswapExchangeRateTask.prototype.outTokenAddress = "";
    
            /**
             * PancakeswapExchangeRateTask inTokenAmount.
             * @member {number} inTokenAmount
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @instance
             */
            PancakeswapExchangeRateTask.prototype.inTokenAmount = 0;
    
            /**
             * PancakeswapExchangeRateTask slippage.
             * @member {number} slippage
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @instance
             */
            PancakeswapExchangeRateTask.prototype.slippage = 0;
    
            /**
             * PancakeswapExchangeRateTask provider.
             * @member {string} provider
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @instance
             */
            PancakeswapExchangeRateTask.prototype.provider = "";
    
            /**
             * Creates a new PancakeswapExchangeRateTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {OracleJob.IPancakeswapExchangeRateTask=} [properties] Properties to set
             * @returns {OracleJob.PancakeswapExchangeRateTask} PancakeswapExchangeRateTask instance
             */
            PancakeswapExchangeRateTask.create = function create(properties) {
                return new PancakeswapExchangeRateTask(properties);
            };
    
            /**
             * Encodes the specified PancakeswapExchangeRateTask message. Does not implicitly {@link OracleJob.PancakeswapExchangeRateTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {OracleJob.IPancakeswapExchangeRateTask} message PancakeswapExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PancakeswapExchangeRateTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.inTokenAddress != null && Object.hasOwnProperty.call(message, "inTokenAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.inTokenAddress);
                if (message.outTokenAddress != null && Object.hasOwnProperty.call(message, "outTokenAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.outTokenAddress);
                if (message.inTokenAmount != null && Object.hasOwnProperty.call(message, "inTokenAmount"))
                    writer.uint32(/* id 3, wireType 1 =*/25).double(message.inTokenAmount);
                if (message.slippage != null && Object.hasOwnProperty.call(message, "slippage"))
                    writer.uint32(/* id 4, wireType 1 =*/33).double(message.slippage);
                if (message.provider != null && Object.hasOwnProperty.call(message, "provider"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.provider);
                return writer;
            };
    
            /**
             * Encodes the specified PancakeswapExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.PancakeswapExchangeRateTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {OracleJob.IPancakeswapExchangeRateTask} message PancakeswapExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PancakeswapExchangeRateTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a PancakeswapExchangeRateTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.PancakeswapExchangeRateTask} PancakeswapExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PancakeswapExchangeRateTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.PancakeswapExchangeRateTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.inTokenAddress = reader.string();
                        break;
                    case 2:
                        message.outTokenAddress = reader.string();
                        break;
                    case 3:
                        message.inTokenAmount = reader.double();
                        break;
                    case 4:
                        message.slippage = reader.double();
                        break;
                    case 5:
                        message.provider = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a PancakeswapExchangeRateTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.PancakeswapExchangeRateTask} PancakeswapExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PancakeswapExchangeRateTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a PancakeswapExchangeRateTask message.
             * @function verify
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PancakeswapExchangeRateTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    if (!$util.isString(message.inTokenAddress))
                        return "inTokenAddress: string expected";
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    if (!$util.isString(message.outTokenAddress))
                        return "outTokenAddress: string expected";
                if (message.inTokenAmount != null && message.hasOwnProperty("inTokenAmount"))
                    if (typeof message.inTokenAmount !== "number")
                        return "inTokenAmount: number expected";
                if (message.slippage != null && message.hasOwnProperty("slippage"))
                    if (typeof message.slippage !== "number")
                        return "slippage: number expected";
                if (message.provider != null && message.hasOwnProperty("provider"))
                    if (!$util.isString(message.provider))
                        return "provider: string expected";
                return null;
            };
    
            /**
             * Creates a PancakeswapExchangeRateTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.PancakeswapExchangeRateTask} PancakeswapExchangeRateTask
             */
            PancakeswapExchangeRateTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.PancakeswapExchangeRateTask)
                    return object;
                var message = new $root.OracleJob.PancakeswapExchangeRateTask();
                if (object.inTokenAddress != null)
                    message.inTokenAddress = String(object.inTokenAddress);
                if (object.outTokenAddress != null)
                    message.outTokenAddress = String(object.outTokenAddress);
                if (object.inTokenAmount != null)
                    message.inTokenAmount = Number(object.inTokenAmount);
                if (object.slippage != null)
                    message.slippage = Number(object.slippage);
                if (object.provider != null)
                    message.provider = String(object.provider);
                return message;
            };
    
            /**
             * Creates a plain object from a PancakeswapExchangeRateTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {OracleJob.PancakeswapExchangeRateTask} message PancakeswapExchangeRateTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PancakeswapExchangeRateTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.inTokenAddress = "";
                    object.outTokenAddress = "";
                    object.inTokenAmount = 0;
                    object.slippage = 0;
                    object.provider = "";
                }
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    object.inTokenAddress = message.inTokenAddress;
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    object.outTokenAddress = message.outTokenAddress;
                if (message.inTokenAmount != null && message.hasOwnProperty("inTokenAmount"))
                    object.inTokenAmount = options.json && !isFinite(message.inTokenAmount) ? String(message.inTokenAmount) : message.inTokenAmount;
                if (message.slippage != null && message.hasOwnProperty("slippage"))
                    object.slippage = options.json && !isFinite(message.slippage) ? String(message.slippage) : message.slippage;
                if (message.provider != null && message.hasOwnProperty("provider"))
                    object.provider = message.provider;
                return object;
            };
    
            /**
             * Converts this PancakeswapExchangeRateTask to JSON.
             * @function toJSON
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PancakeswapExchangeRateTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return PancakeswapExchangeRateTask;
        })();
    
        OracleJob.CacheTask = (function() {
    
            /**
             * Properties of a CacheTask.
             * @memberof OracleJob
             * @interface ICacheTask
             * @property {Array.<OracleJob.CacheTask.ICacheItem>|null} [cacheItems] CacheTask cacheItems
             */
    
            /**
             * Constructs a new CacheTask.
             * @memberof OracleJob
             * @classdesc Represents a CacheTask.
             * @implements ICacheTask
             * @constructor
             * @param {OracleJob.ICacheTask=} [properties] Properties to set
             */
            function CacheTask(properties) {
                this.cacheItems = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * CacheTask cacheItems.
             * @member {Array.<OracleJob.CacheTask.ICacheItem>} cacheItems
             * @memberof OracleJob.CacheTask
             * @instance
             */
            CacheTask.prototype.cacheItems = $util.emptyArray;
    
            /**
             * Creates a new CacheTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.CacheTask
             * @static
             * @param {OracleJob.ICacheTask=} [properties] Properties to set
             * @returns {OracleJob.CacheTask} CacheTask instance
             */
            CacheTask.create = function create(properties) {
                return new CacheTask(properties);
            };
    
            /**
             * Encodes the specified CacheTask message. Does not implicitly {@link OracleJob.CacheTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.CacheTask
             * @static
             * @param {OracleJob.ICacheTask} message CacheTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CacheTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.cacheItems != null && message.cacheItems.length)
                    for (var i = 0; i < message.cacheItems.length; ++i)
                        $root.OracleJob.CacheTask.CacheItem.encode(message.cacheItems[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified CacheTask message, length delimited. Does not implicitly {@link OracleJob.CacheTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.CacheTask
             * @static
             * @param {OracleJob.ICacheTask} message CacheTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CacheTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a CacheTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.CacheTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.CacheTask} CacheTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CacheTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.CacheTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.cacheItems && message.cacheItems.length))
                            message.cacheItems = [];
                        message.cacheItems.push($root.OracleJob.CacheTask.CacheItem.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a CacheTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.CacheTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.CacheTask} CacheTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CacheTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a CacheTask message.
             * @function verify
             * @memberof OracleJob.CacheTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CacheTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.cacheItems != null && message.hasOwnProperty("cacheItems")) {
                    if (!Array.isArray(message.cacheItems))
                        return "cacheItems: array expected";
                    for (var i = 0; i < message.cacheItems.length; ++i) {
                        var error = $root.OracleJob.CacheTask.CacheItem.verify(message.cacheItems[i]);
                        if (error)
                            return "cacheItems." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a CacheTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.CacheTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.CacheTask} CacheTask
             */
            CacheTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.CacheTask)
                    return object;
                var message = new $root.OracleJob.CacheTask();
                if (object.cacheItems) {
                    if (!Array.isArray(object.cacheItems))
                        throw TypeError(".OracleJob.CacheTask.cacheItems: array expected");
                    message.cacheItems = [];
                    for (var i = 0; i < object.cacheItems.length; ++i) {
                        if (typeof object.cacheItems[i] !== "object")
                            throw TypeError(".OracleJob.CacheTask.cacheItems: object expected");
                        message.cacheItems[i] = $root.OracleJob.CacheTask.CacheItem.fromObject(object.cacheItems[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a CacheTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.CacheTask
             * @static
             * @param {OracleJob.CacheTask} message CacheTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CacheTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.cacheItems = [];
                if (message.cacheItems && message.cacheItems.length) {
                    object.cacheItems = [];
                    for (var j = 0; j < message.cacheItems.length; ++j)
                        object.cacheItems[j] = $root.OracleJob.CacheTask.CacheItem.toObject(message.cacheItems[j], options);
                }
                return object;
            };
    
            /**
             * Converts this CacheTask to JSON.
             * @function toJSON
             * @memberof OracleJob.CacheTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CacheTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            CacheTask.CacheItem = (function() {
    
                /**
                 * Properties of a CacheItem.
                 * @memberof OracleJob.CacheTask
                 * @interface ICacheItem
                 * @property {string|null} [variableName] CacheItem variableName
                 * @property {IOracleJob|null} [job] CacheItem job
                 */
    
                /**
                 * Constructs a new CacheItem.
                 * @memberof OracleJob.CacheTask
                 * @classdesc Represents a CacheItem.
                 * @implements ICacheItem
                 * @constructor
                 * @param {OracleJob.CacheTask.ICacheItem=} [properties] Properties to set
                 */
                function CacheItem(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * CacheItem variableName.
                 * @member {string} variableName
                 * @memberof OracleJob.CacheTask.CacheItem
                 * @instance
                 */
                CacheItem.prototype.variableName = "";
    
                /**
                 * CacheItem job.
                 * @member {IOracleJob|null|undefined} job
                 * @memberof OracleJob.CacheTask.CacheItem
                 * @instance
                 */
                CacheItem.prototype.job = null;
    
                /**
                 * Creates a new CacheItem instance using the specified properties.
                 * @function create
                 * @memberof OracleJob.CacheTask.CacheItem
                 * @static
                 * @param {OracleJob.CacheTask.ICacheItem=} [properties] Properties to set
                 * @returns {OracleJob.CacheTask.CacheItem} CacheItem instance
                 */
                CacheItem.create = function create(properties) {
                    return new CacheItem(properties);
                };
    
                /**
                 * Encodes the specified CacheItem message. Does not implicitly {@link OracleJob.CacheTask.CacheItem.verify|verify} messages.
                 * @function encode
                 * @memberof OracleJob.CacheTask.CacheItem
                 * @static
                 * @param {OracleJob.CacheTask.ICacheItem} message CacheItem message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                CacheItem.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.variableName != null && Object.hasOwnProperty.call(message, "variableName"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.variableName);
                    if (message.job != null && Object.hasOwnProperty.call(message, "job"))
                        $root.OracleJob.encode(message.job, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified CacheItem message, length delimited. Does not implicitly {@link OracleJob.CacheTask.CacheItem.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof OracleJob.CacheTask.CacheItem
                 * @static
                 * @param {OracleJob.CacheTask.ICacheItem} message CacheItem message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                CacheItem.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a CacheItem message from the specified reader or buffer.
                 * @function decode
                 * @memberof OracleJob.CacheTask.CacheItem
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {OracleJob.CacheTask.CacheItem} CacheItem
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                CacheItem.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.CacheTask.CacheItem();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.variableName = reader.string();
                            break;
                        case 2:
                            message.job = $root.OracleJob.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a CacheItem message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof OracleJob.CacheTask.CacheItem
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {OracleJob.CacheTask.CacheItem} CacheItem
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                CacheItem.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a CacheItem message.
                 * @function verify
                 * @memberof OracleJob.CacheTask.CacheItem
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                CacheItem.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.variableName != null && message.hasOwnProperty("variableName"))
                        if (!$util.isString(message.variableName))
                            return "variableName: string expected";
                    if (message.job != null && message.hasOwnProperty("job")) {
                        var error = $root.OracleJob.verify(message.job);
                        if (error)
                            return "job." + error;
                    }
                    return null;
                };
    
                /**
                 * Creates a CacheItem message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof OracleJob.CacheTask.CacheItem
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {OracleJob.CacheTask.CacheItem} CacheItem
                 */
                CacheItem.fromObject = function fromObject(object) {
                    if (object instanceof $root.OracleJob.CacheTask.CacheItem)
                        return object;
                    var message = new $root.OracleJob.CacheTask.CacheItem();
                    if (object.variableName != null)
                        message.variableName = String(object.variableName);
                    if (object.job != null) {
                        if (typeof object.job !== "object")
                            throw TypeError(".OracleJob.CacheTask.CacheItem.job: object expected");
                        message.job = $root.OracleJob.fromObject(object.job);
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a CacheItem message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof OracleJob.CacheTask.CacheItem
                 * @static
                 * @param {OracleJob.CacheTask.CacheItem} message CacheItem
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                CacheItem.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.variableName = "";
                        object.job = null;
                    }
                    if (message.variableName != null && message.hasOwnProperty("variableName"))
                        object.variableName = message.variableName;
                    if (message.job != null && message.hasOwnProperty("job"))
                        object.job = $root.OracleJob.toObject(message.job, options);
                    return object;
                };
    
                /**
                 * Converts this CacheItem to JSON.
                 * @function toJSON
                 * @memberof OracleJob.CacheTask.CacheItem
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                CacheItem.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return CacheItem;
            })();
    
            return CacheTask;
        })();
    
        OracleJob.SysclockOffsetTask = (function() {
    
            /**
             * Properties of a SysclockOffsetTask.
             * @memberof OracleJob
             * @interface ISysclockOffsetTask
             */
    
            /**
             * Constructs a new SysclockOffsetTask.
             * @memberof OracleJob
             * @classdesc Represents a SysclockOffsetTask.
             * @implements ISysclockOffsetTask
             * @constructor
             * @param {OracleJob.ISysclockOffsetTask=} [properties] Properties to set
             */
            function SysclockOffsetTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Creates a new SysclockOffsetTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {OracleJob.ISysclockOffsetTask=} [properties] Properties to set
             * @returns {OracleJob.SysclockOffsetTask} SysclockOffsetTask instance
             */
            SysclockOffsetTask.create = function create(properties) {
                return new SysclockOffsetTask(properties);
            };
    
            /**
             * Encodes the specified SysclockOffsetTask message. Does not implicitly {@link OracleJob.SysclockOffsetTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {OracleJob.ISysclockOffsetTask} message SysclockOffsetTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SysclockOffsetTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };
    
            /**
             * Encodes the specified SysclockOffsetTask message, length delimited. Does not implicitly {@link OracleJob.SysclockOffsetTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {OracleJob.ISysclockOffsetTask} message SysclockOffsetTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SysclockOffsetTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SysclockOffsetTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.SysclockOffsetTask} SysclockOffsetTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SysclockOffsetTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.SysclockOffsetTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SysclockOffsetTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.SysclockOffsetTask} SysclockOffsetTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SysclockOffsetTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SysclockOffsetTask message.
             * @function verify
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SysclockOffsetTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };
    
            /**
             * Creates a SysclockOffsetTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.SysclockOffsetTask} SysclockOffsetTask
             */
            SysclockOffsetTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.SysclockOffsetTask)
                    return object;
                return new $root.OracleJob.SysclockOffsetTask();
            };
    
            /**
             * Creates a plain object from a SysclockOffsetTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {OracleJob.SysclockOffsetTask} message SysclockOffsetTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SysclockOffsetTask.toObject = function toObject() {
                return {};
            };
    
            /**
             * Converts this SysclockOffsetTask to JSON.
             * @function toJSON
             * @memberof OracleJob.SysclockOffsetTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SysclockOffsetTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SysclockOffsetTask;
        })();
    
        OracleJob.MarinadeStateTask = (function() {
    
            /**
             * Properties of a MarinadeStateTask.
             * @memberof OracleJob
             * @interface IMarinadeStateTask
             */
    
            /**
             * Constructs a new MarinadeStateTask.
             * @memberof OracleJob
             * @classdesc Represents a MarinadeStateTask.
             * @implements IMarinadeStateTask
             * @constructor
             * @param {OracleJob.IMarinadeStateTask=} [properties] Properties to set
             */
            function MarinadeStateTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Creates a new MarinadeStateTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.MarinadeStateTask
             * @static
             * @param {OracleJob.IMarinadeStateTask=} [properties] Properties to set
             * @returns {OracleJob.MarinadeStateTask} MarinadeStateTask instance
             */
            MarinadeStateTask.create = function create(properties) {
                return new MarinadeStateTask(properties);
            };
    
            /**
             * Encodes the specified MarinadeStateTask message. Does not implicitly {@link OracleJob.MarinadeStateTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.MarinadeStateTask
             * @static
             * @param {OracleJob.IMarinadeStateTask} message MarinadeStateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarinadeStateTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };
    
            /**
             * Encodes the specified MarinadeStateTask message, length delimited. Does not implicitly {@link OracleJob.MarinadeStateTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.MarinadeStateTask
             * @static
             * @param {OracleJob.IMarinadeStateTask} message MarinadeStateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarinadeStateTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a MarinadeStateTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.MarinadeStateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.MarinadeStateTask} MarinadeStateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarinadeStateTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.MarinadeStateTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a MarinadeStateTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.MarinadeStateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.MarinadeStateTask} MarinadeStateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarinadeStateTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a MarinadeStateTask message.
             * @function verify
             * @memberof OracleJob.MarinadeStateTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MarinadeStateTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };
    
            /**
             * Creates a MarinadeStateTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.MarinadeStateTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.MarinadeStateTask} MarinadeStateTask
             */
            MarinadeStateTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.MarinadeStateTask)
                    return object;
                return new $root.OracleJob.MarinadeStateTask();
            };
    
            /**
             * Creates a plain object from a MarinadeStateTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.MarinadeStateTask
             * @static
             * @param {OracleJob.MarinadeStateTask} message MarinadeStateTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MarinadeStateTask.toObject = function toObject() {
                return {};
            };
    
            /**
             * Converts this MarinadeStateTask to JSON.
             * @function toJSON
             * @memberof OracleJob.MarinadeStateTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MarinadeStateTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return MarinadeStateTask;
        })();
    
        OracleJob.SolanaAccountDataFetchTask = (function() {
    
            /**
             * Properties of a SolanaAccountDataFetchTask.
             * @memberof OracleJob
             * @interface ISolanaAccountDataFetchTask
             * @property {string|null} [pubkey] SolanaAccountDataFetchTask pubkey
             */
    
            /**
             * Constructs a new SolanaAccountDataFetchTask.
             * @memberof OracleJob
             * @classdesc Represents a SolanaAccountDataFetchTask.
             * @implements ISolanaAccountDataFetchTask
             * @constructor
             * @param {OracleJob.ISolanaAccountDataFetchTask=} [properties] Properties to set
             */
            function SolanaAccountDataFetchTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SolanaAccountDataFetchTask pubkey.
             * @member {string} pubkey
             * @memberof OracleJob.SolanaAccountDataFetchTask
             * @instance
             */
            SolanaAccountDataFetchTask.prototype.pubkey = "";
    
            /**
             * Creates a new SolanaAccountDataFetchTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.SolanaAccountDataFetchTask
             * @static
             * @param {OracleJob.ISolanaAccountDataFetchTask=} [properties] Properties to set
             * @returns {OracleJob.SolanaAccountDataFetchTask} SolanaAccountDataFetchTask instance
             */
            SolanaAccountDataFetchTask.create = function create(properties) {
                return new SolanaAccountDataFetchTask(properties);
            };
    
            /**
             * Encodes the specified SolanaAccountDataFetchTask message. Does not implicitly {@link OracleJob.SolanaAccountDataFetchTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.SolanaAccountDataFetchTask
             * @static
             * @param {OracleJob.ISolanaAccountDataFetchTask} message SolanaAccountDataFetchTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SolanaAccountDataFetchTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.pubkey != null && Object.hasOwnProperty.call(message, "pubkey"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.pubkey);
                return writer;
            };
    
            /**
             * Encodes the specified SolanaAccountDataFetchTask message, length delimited. Does not implicitly {@link OracleJob.SolanaAccountDataFetchTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.SolanaAccountDataFetchTask
             * @static
             * @param {OracleJob.ISolanaAccountDataFetchTask} message SolanaAccountDataFetchTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SolanaAccountDataFetchTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SolanaAccountDataFetchTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.SolanaAccountDataFetchTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.SolanaAccountDataFetchTask} SolanaAccountDataFetchTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SolanaAccountDataFetchTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.SolanaAccountDataFetchTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.pubkey = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SolanaAccountDataFetchTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.SolanaAccountDataFetchTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.SolanaAccountDataFetchTask} SolanaAccountDataFetchTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SolanaAccountDataFetchTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SolanaAccountDataFetchTask message.
             * @function verify
             * @memberof OracleJob.SolanaAccountDataFetchTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SolanaAccountDataFetchTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.pubkey != null && message.hasOwnProperty("pubkey"))
                    if (!$util.isString(message.pubkey))
                        return "pubkey: string expected";
                return null;
            };
    
            /**
             * Creates a SolanaAccountDataFetchTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.SolanaAccountDataFetchTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.SolanaAccountDataFetchTask} SolanaAccountDataFetchTask
             */
            SolanaAccountDataFetchTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.SolanaAccountDataFetchTask)
                    return object;
                var message = new $root.OracleJob.SolanaAccountDataFetchTask();
                if (object.pubkey != null)
                    message.pubkey = String(object.pubkey);
                return message;
            };
    
            /**
             * Creates a plain object from a SolanaAccountDataFetchTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.SolanaAccountDataFetchTask
             * @static
             * @param {OracleJob.SolanaAccountDataFetchTask} message SolanaAccountDataFetchTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SolanaAccountDataFetchTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.pubkey = "";
                if (message.pubkey != null && message.hasOwnProperty("pubkey"))
                    object.pubkey = message.pubkey;
                return object;
            };
    
            /**
             * Converts this SolanaAccountDataFetchTask to JSON.
             * @function toJSON
             * @memberof OracleJob.SolanaAccountDataFetchTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SolanaAccountDataFetchTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SolanaAccountDataFetchTask;
        })();
    
        OracleJob.CronParseTask = (function() {
    
            /**
             * Properties of a CronParseTask.
             * @memberof OracleJob
             * @interface ICronParseTask
             * @property {string|null} [cronPattern] CronParseTask cronPattern
             * @property {number|null} [clockOffset] CronParseTask clockOffset
             * @property {OracleJob.CronParseTask.ClockType|null} [clock] CronParseTask clock
             */
    
            /**
             * Constructs a new CronParseTask.
             * @memberof OracleJob
             * @classdesc Represents a CronParseTask.
             * @implements ICronParseTask
             * @constructor
             * @param {OracleJob.ICronParseTask=} [properties] Properties to set
             */
            function CronParseTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * CronParseTask cronPattern.
             * @member {string} cronPattern
             * @memberof OracleJob.CronParseTask
             * @instance
             */
            CronParseTask.prototype.cronPattern = "";
    
            /**
             * CronParseTask clockOffset.
             * @member {number} clockOffset
             * @memberof OracleJob.CronParseTask
             * @instance
             */
            CronParseTask.prototype.clockOffset = 0;
    
            /**
             * CronParseTask clock.
             * @member {OracleJob.CronParseTask.ClockType} clock
             * @memberof OracleJob.CronParseTask
             * @instance
             */
            CronParseTask.prototype.clock = 0;
    
            /**
             * Creates a new CronParseTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.CronParseTask
             * @static
             * @param {OracleJob.ICronParseTask=} [properties] Properties to set
             * @returns {OracleJob.CronParseTask} CronParseTask instance
             */
            CronParseTask.create = function create(properties) {
                return new CronParseTask(properties);
            };
    
            /**
             * Encodes the specified CronParseTask message. Does not implicitly {@link OracleJob.CronParseTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.CronParseTask
             * @static
             * @param {OracleJob.ICronParseTask} message CronParseTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CronParseTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.cronPattern != null && Object.hasOwnProperty.call(message, "cronPattern"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.cronPattern);
                if (message.clockOffset != null && Object.hasOwnProperty.call(message, "clockOffset"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.clockOffset);
                if (message.clock != null && Object.hasOwnProperty.call(message, "clock"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.clock);
                return writer;
            };
    
            /**
             * Encodes the specified CronParseTask message, length delimited. Does not implicitly {@link OracleJob.CronParseTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.CronParseTask
             * @static
             * @param {OracleJob.ICronParseTask} message CronParseTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CronParseTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a CronParseTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.CronParseTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.CronParseTask} CronParseTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CronParseTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.CronParseTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.cronPattern = reader.string();
                        break;
                    case 2:
                        message.clockOffset = reader.int32();
                        break;
                    case 3:
                        message.clock = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a CronParseTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.CronParseTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.CronParseTask} CronParseTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CronParseTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a CronParseTask message.
             * @function verify
             * @memberof OracleJob.CronParseTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CronParseTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.cronPattern != null && message.hasOwnProperty("cronPattern"))
                    if (!$util.isString(message.cronPattern))
                        return "cronPattern: string expected";
                if (message.clockOffset != null && message.hasOwnProperty("clockOffset"))
                    if (!$util.isInteger(message.clockOffset))
                        return "clockOffset: integer expected";
                if (message.clock != null && message.hasOwnProperty("clock"))
                    switch (message.clock) {
                    default:
                        return "clock: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                return null;
            };
    
            /**
             * Creates a CronParseTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.CronParseTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.CronParseTask} CronParseTask
             */
            CronParseTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.CronParseTask)
                    return object;
                var message = new $root.OracleJob.CronParseTask();
                if (object.cronPattern != null)
                    message.cronPattern = String(object.cronPattern);
                if (object.clockOffset != null)
                    message.clockOffset = object.clockOffset | 0;
                switch (object.clock) {
                case "ORACLE":
                case 0:
                    message.clock = 0;
                    break;
                case "SYSCLOCK":
                case 1:
                    message.clock = 1;
                    break;
                }
                return message;
            };
    
            /**
             * Creates a plain object from a CronParseTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.CronParseTask
             * @static
             * @param {OracleJob.CronParseTask} message CronParseTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CronParseTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.cronPattern = "";
                    object.clockOffset = 0;
                    object.clock = options.enums === String ? "ORACLE" : 0;
                }
                if (message.cronPattern != null && message.hasOwnProperty("cronPattern"))
                    object.cronPattern = message.cronPattern;
                if (message.clockOffset != null && message.hasOwnProperty("clockOffset"))
                    object.clockOffset = message.clockOffset;
                if (message.clock != null && message.hasOwnProperty("clock"))
                    object.clock = options.enums === String ? $root.OracleJob.CronParseTask.ClockType[message.clock] : message.clock;
                return object;
            };
    
            /**
             * Converts this CronParseTask to JSON.
             * @function toJSON
             * @memberof OracleJob.CronParseTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CronParseTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            /**
             * ClockType enum.
             * @name OracleJob.CronParseTask.ClockType
             * @enum {number}
             * @property {number} ORACLE=0 ORACLE value
             * @property {number} SYSCLOCK=1 SYSCLOCK value
             */
            CronParseTask.ClockType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "ORACLE"] = 0;
                values[valuesById[1] = "SYSCLOCK"] = 1;
                return values;
            })();
    
            return CronParseTask;
        })();
    
        OracleJob.BufferLayoutParseTask = (function() {
    
            /**
             * Properties of a BufferLayoutParseTask.
             * @memberof OracleJob
             * @interface IBufferLayoutParseTask
             * @property {number|null} [offset] BufferLayoutParseTask offset
             * @property {OracleJob.BufferLayoutParseTask.Endian|null} [endian] BufferLayoutParseTask endian
             * @property {OracleJob.BufferLayoutParseTask.BufferParseType|null} [type] BufferLayoutParseTask type
             */
    
            /**
             * Constructs a new BufferLayoutParseTask.
             * @memberof OracleJob
             * @classdesc Represents a BufferLayoutParseTask.
             * @implements IBufferLayoutParseTask
             * @constructor
             * @param {OracleJob.IBufferLayoutParseTask=} [properties] Properties to set
             */
            function BufferLayoutParseTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * BufferLayoutParseTask offset.
             * @member {number} offset
             * @memberof OracleJob.BufferLayoutParseTask
             * @instance
             */
            BufferLayoutParseTask.prototype.offset = 0;
    
            /**
             * BufferLayoutParseTask endian.
             * @member {OracleJob.BufferLayoutParseTask.Endian} endian
             * @memberof OracleJob.BufferLayoutParseTask
             * @instance
             */
            BufferLayoutParseTask.prototype.endian = 0;
    
            /**
             * BufferLayoutParseTask type.
             * @member {OracleJob.BufferLayoutParseTask.BufferParseType} type
             * @memberof OracleJob.BufferLayoutParseTask
             * @instance
             */
            BufferLayoutParseTask.prototype.type = 1;
    
            /**
             * Creates a new BufferLayoutParseTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.BufferLayoutParseTask
             * @static
             * @param {OracleJob.IBufferLayoutParseTask=} [properties] Properties to set
             * @returns {OracleJob.BufferLayoutParseTask} BufferLayoutParseTask instance
             */
            BufferLayoutParseTask.create = function create(properties) {
                return new BufferLayoutParseTask(properties);
            };
    
            /**
             * Encodes the specified BufferLayoutParseTask message. Does not implicitly {@link OracleJob.BufferLayoutParseTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.BufferLayoutParseTask
             * @static
             * @param {OracleJob.IBufferLayoutParseTask} message BufferLayoutParseTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BufferLayoutParseTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.offset);
                if (message.endian != null && Object.hasOwnProperty.call(message, "endian"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.endian);
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.type);
                return writer;
            };
    
            /**
             * Encodes the specified BufferLayoutParseTask message, length delimited. Does not implicitly {@link OracleJob.BufferLayoutParseTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.BufferLayoutParseTask
             * @static
             * @param {OracleJob.IBufferLayoutParseTask} message BufferLayoutParseTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BufferLayoutParseTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a BufferLayoutParseTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.BufferLayoutParseTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.BufferLayoutParseTask} BufferLayoutParseTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BufferLayoutParseTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.BufferLayoutParseTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.offset = reader.uint32();
                        break;
                    case 2:
                        message.endian = reader.int32();
                        break;
                    case 3:
                        message.type = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a BufferLayoutParseTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.BufferLayoutParseTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.BufferLayoutParseTask} BufferLayoutParseTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BufferLayoutParseTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a BufferLayoutParseTask message.
             * @function verify
             * @memberof OracleJob.BufferLayoutParseTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BufferLayoutParseTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.offset != null && message.hasOwnProperty("offset"))
                    if (!$util.isInteger(message.offset))
                        return "offset: integer expected";
                if (message.endian != null && message.hasOwnProperty("endian"))
                    switch (message.endian) {
                    default:
                        return "endian: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                        break;
                    }
                return null;
            };
    
            /**
             * Creates a BufferLayoutParseTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.BufferLayoutParseTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.BufferLayoutParseTask} BufferLayoutParseTask
             */
            BufferLayoutParseTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.BufferLayoutParseTask)
                    return object;
                var message = new $root.OracleJob.BufferLayoutParseTask();
                if (object.offset != null)
                    message.offset = object.offset >>> 0;
                switch (object.endian) {
                case "LITTLE_ENDIAN":
                case 0:
                    message.endian = 0;
                    break;
                case "BIG_ENDIAN":
                case 1:
                    message.endian = 1;
                    break;
                }
                switch (object.type) {
                case "pubkey":
                case 1:
                    message.type = 1;
                    break;
                case "bool":
                case 2:
                    message.type = 2;
                    break;
                case "u8":
                case 3:
                    message.type = 3;
                    break;
                case "i8":
                case 4:
                    message.type = 4;
                    break;
                case "u16":
                case 5:
                    message.type = 5;
                    break;
                case "i16":
                case 6:
                    message.type = 6;
                    break;
                case "u32":
                case 7:
                    message.type = 7;
                    break;
                case "i32":
                case 8:
                    message.type = 8;
                    break;
                case "f32":
                case 9:
                    message.type = 9;
                    break;
                case "u64":
                case 10:
                    message.type = 10;
                    break;
                case "i64":
                case 11:
                    message.type = 11;
                    break;
                case "f64":
                case 12:
                    message.type = 12;
                    break;
                case "u128":
                case 13:
                    message.type = 13;
                    break;
                case "i128":
                case 14:
                    message.type = 14;
                    break;
                }
                return message;
            };
    
            /**
             * Creates a plain object from a BufferLayoutParseTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.BufferLayoutParseTask
             * @static
             * @param {OracleJob.BufferLayoutParseTask} message BufferLayoutParseTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BufferLayoutParseTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.offset = 0;
                    object.endian = options.enums === String ? "LITTLE_ENDIAN" : 0;
                    object.type = options.enums === String ? "pubkey" : 1;
                }
                if (message.offset != null && message.hasOwnProperty("offset"))
                    object.offset = message.offset;
                if (message.endian != null && message.hasOwnProperty("endian"))
                    object.endian = options.enums === String ? $root.OracleJob.BufferLayoutParseTask.Endian[message.endian] : message.endian;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.OracleJob.BufferLayoutParseTask.BufferParseType[message.type] : message.type;
                return object;
            };
    
            /**
             * Converts this BufferLayoutParseTask to JSON.
             * @function toJSON
             * @memberof OracleJob.BufferLayoutParseTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BufferLayoutParseTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            /**
             * Endian enum.
             * @name OracleJob.BufferLayoutParseTask.Endian
             * @enum {number}
             * @property {number} LITTLE_ENDIAN=0 LITTLE_ENDIAN value
             * @property {number} BIG_ENDIAN=1 BIG_ENDIAN value
             */
            BufferLayoutParseTask.Endian = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "LITTLE_ENDIAN"] = 0;
                values[valuesById[1] = "BIG_ENDIAN"] = 1;
                return values;
            })();
    
            /**
             * BufferParseType enum.
             * @name OracleJob.BufferLayoutParseTask.BufferParseType
             * @enum {number}
             * @property {number} pubkey=1 pubkey value
             * @property {number} bool=2 bool value
             * @property {number} u8=3 u8 value
             * @property {number} i8=4 i8 value
             * @property {number} u16=5 u16 value
             * @property {number} i16=6 i16 value
             * @property {number} u32=7 u32 value
             * @property {number} i32=8 i32 value
             * @property {number} f32=9 f32 value
             * @property {number} u64=10 u64 value
             * @property {number} i64=11 i64 value
             * @property {number} f64=12 f64 value
             * @property {number} u128=13 u128 value
             * @property {number} i128=14 i128 value
             */
            BufferLayoutParseTask.BufferParseType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[1] = "pubkey"] = 1;
                values[valuesById[2] = "bool"] = 2;
                values[valuesById[3] = "u8"] = 3;
                values[valuesById[4] = "i8"] = 4;
                values[valuesById[5] = "u16"] = 5;
                values[valuesById[6] = "i16"] = 6;
                values[valuesById[7] = "u32"] = 7;
                values[valuesById[8] = "i32"] = 8;
                values[valuesById[9] = "f32"] = 9;
                values[valuesById[10] = "u64"] = 10;
                values[valuesById[11] = "i64"] = 11;
                values[valuesById[12] = "f64"] = 12;
                values[valuesById[13] = "u128"] = 13;
                values[valuesById[14] = "i128"] = 14;
                return values;
            })();
    
            return BufferLayoutParseTask;
        })();
    
        OracleJob.Task = (function() {
    
            /**
             * Properties of a Task.
             * @memberof OracleJob
             * @interface ITask
             * @property {OracleJob.IHttpTask|null} [httpTask] Task httpTask
             * @property {OracleJob.IJsonParseTask|null} [jsonParseTask] Task jsonParseTask
             * @property {OracleJob.IMedianTask|null} [medianTask] Task medianTask
             * @property {OracleJob.IMeanTask|null} [meanTask] Task meanTask
             * @property {OracleJob.IWebsocketTask|null} [websocketTask] Task websocketTask
             * @property {OracleJob.IDivideTask|null} [divideTask] Task divideTask
             * @property {OracleJob.IMultiplyTask|null} [multiplyTask] Task multiplyTask
             * @property {OracleJob.ILpTokenPriceTask|null} [lpTokenPriceTask] Task lpTokenPriceTask
             * @property {OracleJob.ILpExchangeRateTask|null} [lpExchangeRateTask] Task lpExchangeRateTask
             * @property {OracleJob.IConditionalTask|null} [conditionalTask] Task conditionalTask
             * @property {OracleJob.IValueTask|null} [valueTask] Task valueTask
             * @property {OracleJob.IMaxTask|null} [maxTask] Task maxTask
             * @property {OracleJob.IRegexExtractTask|null} [regexExtractTask] Task regexExtractTask
             * @property {OracleJob.IXStepPriceTask|null} [xstepPriceTask] Task xstepPriceTask
             * @property {OracleJob.IAddTask|null} [addTask] Task addTask
             * @property {OracleJob.ISubtractTask|null} [subtractTask] Task subtractTask
             * @property {OracleJob.ITwapTask|null} [twapTask] Task twapTask
             * @property {OracleJob.ISerumSwapTask|null} [serumSwapTask] Task serumSwapTask
             * @property {OracleJob.IPowTask|null} [powTask] Task powTask
             * @property {OracleJob.ILendingRateTask|null} [lendingRateTask] Task lendingRateTask
             * @property {OracleJob.IMangoPerpMarketTask|null} [mangoPerpMarketTask] Task mangoPerpMarketTask
             * @property {OracleJob.IJupiterSwapTask|null} [jupiterSwapTask] Task jupiterSwapTask
             * @property {OracleJob.IPerpMarketTask|null} [perpMarketTask] Task perpMarketTask
             * @property {OracleJob.IOracleTask|null} [oracleTask] Task oracleTask
             * @property {OracleJob.IAnchorFetchTask|null} [anchorFetchTask] Task anchorFetchTask
             * @property {OracleJob.IDefiKingdomsTask|null} [defiKingdomsTask] Task defiKingdomsTask
             * @property {OracleJob.ITpsTask|null} [tpsTask] Task tpsTask
             * @property {OracleJob.ISplStakePoolTask|null} [splStakePoolTask] Task splStakePoolTask
             * @property {OracleJob.ISplTokenParseTask|null} [splTokenParseTask] Task splTokenParseTask
             * @property {OracleJob.IUniswapExchangeRateTask|null} [uniswapExchangeRateTask] Task uniswapExchangeRateTask
             * @property {OracleJob.ISushiswapExchangeRateTask|null} [sushiswapExchangeRateTask] Task sushiswapExchangeRateTask
             * @property {OracleJob.IPancakeswapExchangeRateTask|null} [pancakeswapExchangeRateTask] Task pancakeswapExchangeRateTask
             * @property {OracleJob.ICacheTask|null} [cacheTask] Task cacheTask
             * @property {OracleJob.ISysclockOffsetTask|null} [sysclockOffsetTask] Task sysclockOffsetTask
             * @property {OracleJob.IMarinadeStateTask|null} [marinadeStateTask] Task marinadeStateTask
             * @property {OracleJob.ISolanaAccountDataFetchTask|null} [solanaAccountDataFetchTask] Task solanaAccountDataFetchTask
             * @property {OracleJob.IBufferLayoutParseTask|null} [bufferLayoutParseTask] Task bufferLayoutParseTask
             * @property {OracleJob.ICronParseTask|null} [cronParseTask] Task cronParseTask
             */
    
            /**
             * Constructs a new Task.
             * @memberof OracleJob
             * @classdesc Represents a Task.
             * @implements ITask
             * @constructor
             * @param {OracleJob.ITask=} [properties] Properties to set
             */
            function Task(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Task httpTask.
             * @member {OracleJob.IHttpTask|null|undefined} httpTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.httpTask = null;
    
            /**
             * Task jsonParseTask.
             * @member {OracleJob.IJsonParseTask|null|undefined} jsonParseTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.jsonParseTask = null;
    
            /**
             * Task medianTask.
             * @member {OracleJob.IMedianTask|null|undefined} medianTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.medianTask = null;
    
            /**
             * Task meanTask.
             * @member {OracleJob.IMeanTask|null|undefined} meanTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.meanTask = null;
    
            /**
             * Task websocketTask.
             * @member {OracleJob.IWebsocketTask|null|undefined} websocketTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.websocketTask = null;
    
            /**
             * Task divideTask.
             * @member {OracleJob.IDivideTask|null|undefined} divideTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.divideTask = null;
    
            /**
             * Task multiplyTask.
             * @member {OracleJob.IMultiplyTask|null|undefined} multiplyTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.multiplyTask = null;
    
            /**
             * Task lpTokenPriceTask.
             * @member {OracleJob.ILpTokenPriceTask|null|undefined} lpTokenPriceTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.lpTokenPriceTask = null;
    
            /**
             * Task lpExchangeRateTask.
             * @member {OracleJob.ILpExchangeRateTask|null|undefined} lpExchangeRateTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.lpExchangeRateTask = null;
    
            /**
             * Task conditionalTask.
             * @member {OracleJob.IConditionalTask|null|undefined} conditionalTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.conditionalTask = null;
    
            /**
             * Task valueTask.
             * @member {OracleJob.IValueTask|null|undefined} valueTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.valueTask = null;
    
            /**
             * Task maxTask.
             * @member {OracleJob.IMaxTask|null|undefined} maxTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.maxTask = null;
    
            /**
             * Task regexExtractTask.
             * @member {OracleJob.IRegexExtractTask|null|undefined} regexExtractTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.regexExtractTask = null;
    
            /**
             * Task xstepPriceTask.
             * @member {OracleJob.IXStepPriceTask|null|undefined} xstepPriceTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.xstepPriceTask = null;
    
            /**
             * Task addTask.
             * @member {OracleJob.IAddTask|null|undefined} addTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.addTask = null;
    
            /**
             * Task subtractTask.
             * @member {OracleJob.ISubtractTask|null|undefined} subtractTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.subtractTask = null;
    
            /**
             * Task twapTask.
             * @member {OracleJob.ITwapTask|null|undefined} twapTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.twapTask = null;
    
            /**
             * Task serumSwapTask.
             * @member {OracleJob.ISerumSwapTask|null|undefined} serumSwapTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.serumSwapTask = null;
    
            /**
             * Task powTask.
             * @member {OracleJob.IPowTask|null|undefined} powTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.powTask = null;
    
            /**
             * Task lendingRateTask.
             * @member {OracleJob.ILendingRateTask|null|undefined} lendingRateTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.lendingRateTask = null;
    
            /**
             * Task mangoPerpMarketTask.
             * @member {OracleJob.IMangoPerpMarketTask|null|undefined} mangoPerpMarketTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.mangoPerpMarketTask = null;
    
            /**
             * Task jupiterSwapTask.
             * @member {OracleJob.IJupiterSwapTask|null|undefined} jupiterSwapTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.jupiterSwapTask = null;
    
            /**
             * Task perpMarketTask.
             * @member {OracleJob.IPerpMarketTask|null|undefined} perpMarketTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.perpMarketTask = null;
    
            /**
             * Task oracleTask.
             * @member {OracleJob.IOracleTask|null|undefined} oracleTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.oracleTask = null;
    
            /**
             * Task anchorFetchTask.
             * @member {OracleJob.IAnchorFetchTask|null|undefined} anchorFetchTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.anchorFetchTask = null;
    
            /**
             * Task defiKingdomsTask.
             * @member {OracleJob.IDefiKingdomsTask|null|undefined} defiKingdomsTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.defiKingdomsTask = null;
    
            /**
             * Task tpsTask.
             * @member {OracleJob.ITpsTask|null|undefined} tpsTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.tpsTask = null;
    
            /**
             * Task splStakePoolTask.
             * @member {OracleJob.ISplStakePoolTask|null|undefined} splStakePoolTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.splStakePoolTask = null;
    
            /**
             * Task splTokenParseTask.
             * @member {OracleJob.ISplTokenParseTask|null|undefined} splTokenParseTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.splTokenParseTask = null;
    
            /**
             * Task uniswapExchangeRateTask.
             * @member {OracleJob.IUniswapExchangeRateTask|null|undefined} uniswapExchangeRateTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.uniswapExchangeRateTask = null;
    
            /**
             * Task sushiswapExchangeRateTask.
             * @member {OracleJob.ISushiswapExchangeRateTask|null|undefined} sushiswapExchangeRateTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.sushiswapExchangeRateTask = null;
    
            /**
             * Task pancakeswapExchangeRateTask.
             * @member {OracleJob.IPancakeswapExchangeRateTask|null|undefined} pancakeswapExchangeRateTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.pancakeswapExchangeRateTask = null;
    
            /**
             * Task cacheTask.
             * @member {OracleJob.ICacheTask|null|undefined} cacheTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.cacheTask = null;
    
            /**
             * Task sysclockOffsetTask.
             * @member {OracleJob.ISysclockOffsetTask|null|undefined} sysclockOffsetTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.sysclockOffsetTask = null;
    
            /**
             * Task marinadeStateTask.
             * @member {OracleJob.IMarinadeStateTask|null|undefined} marinadeStateTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.marinadeStateTask = null;
    
            /**
             * Task solanaAccountDataFetchTask.
             * @member {OracleJob.ISolanaAccountDataFetchTask|null|undefined} solanaAccountDataFetchTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.solanaAccountDataFetchTask = null;
    
            /**
             * Task bufferLayoutParseTask.
             * @member {OracleJob.IBufferLayoutParseTask|null|undefined} bufferLayoutParseTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.bufferLayoutParseTask = null;
    
            /**
             * Task cronParseTask.
             * @member {OracleJob.ICronParseTask|null|undefined} cronParseTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.cronParseTask = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * Task Task.
             * @member {"httpTask"|"jsonParseTask"|"medianTask"|"meanTask"|"websocketTask"|"divideTask"|"multiplyTask"|"lpTokenPriceTask"|"lpExchangeRateTask"|"conditionalTask"|"valueTask"|"maxTask"|"regexExtractTask"|"xstepPriceTask"|"addTask"|"subtractTask"|"twapTask"|"serumSwapTask"|"powTask"|"lendingRateTask"|"mangoPerpMarketTask"|"jupiterSwapTask"|"perpMarketTask"|"oracleTask"|"anchorFetchTask"|"defiKingdomsTask"|"tpsTask"|"splStakePoolTask"|"splTokenParseTask"|"uniswapExchangeRateTask"|"sushiswapExchangeRateTask"|"pancakeswapExchangeRateTask"|"cacheTask"|"sysclockOffsetTask"|"marinadeStateTask"|"solanaAccountDataFetchTask"|"bufferLayoutParseTask"|"cronParseTask"|undefined} Task
             * @memberof OracleJob.Task
             * @instance
             */
            Object.defineProperty(Task.prototype, "Task", {
                get: $util.oneOfGetter($oneOfFields = ["httpTask", "jsonParseTask", "medianTask", "meanTask", "websocketTask", "divideTask", "multiplyTask", "lpTokenPriceTask", "lpExchangeRateTask", "conditionalTask", "valueTask", "maxTask", "regexExtractTask", "xstepPriceTask", "addTask", "subtractTask", "twapTask", "serumSwapTask", "powTask", "lendingRateTask", "mangoPerpMarketTask", "jupiterSwapTask", "perpMarketTask", "oracleTask", "anchorFetchTask", "defiKingdomsTask", "tpsTask", "splStakePoolTask", "splTokenParseTask", "uniswapExchangeRateTask", "sushiswapExchangeRateTask", "pancakeswapExchangeRateTask", "cacheTask", "sysclockOffsetTask", "marinadeStateTask", "solanaAccountDataFetchTask", "bufferLayoutParseTask", "cronParseTask"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new Task instance using the specified properties.
             * @function create
             * @memberof OracleJob.Task
             * @static
             * @param {OracleJob.ITask=} [properties] Properties to set
             * @returns {OracleJob.Task} Task instance
             */
            Task.create = function create(properties) {
                return new Task(properties);
            };
    
            /**
             * Encodes the specified Task message. Does not implicitly {@link OracleJob.Task.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.Task
             * @static
             * @param {OracleJob.ITask} message Task message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Task.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.httpTask != null && Object.hasOwnProperty.call(message, "httpTask"))
                    $root.OracleJob.HttpTask.encode(message.httpTask, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.jsonParseTask != null && Object.hasOwnProperty.call(message, "jsonParseTask"))
                    $root.OracleJob.JsonParseTask.encode(message.jsonParseTask, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.medianTask != null && Object.hasOwnProperty.call(message, "medianTask"))
                    $root.OracleJob.MedianTask.encode(message.medianTask, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.meanTask != null && Object.hasOwnProperty.call(message, "meanTask"))
                    $root.OracleJob.MeanTask.encode(message.meanTask, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.websocketTask != null && Object.hasOwnProperty.call(message, "websocketTask"))
                    $root.OracleJob.WebsocketTask.encode(message.websocketTask, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.divideTask != null && Object.hasOwnProperty.call(message, "divideTask"))
                    $root.OracleJob.DivideTask.encode(message.divideTask, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.multiplyTask != null && Object.hasOwnProperty.call(message, "multiplyTask"))
                    $root.OracleJob.MultiplyTask.encode(message.multiplyTask, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.lpTokenPriceTask != null && Object.hasOwnProperty.call(message, "lpTokenPriceTask"))
                    $root.OracleJob.LpTokenPriceTask.encode(message.lpTokenPriceTask, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.lpExchangeRateTask != null && Object.hasOwnProperty.call(message, "lpExchangeRateTask"))
                    $root.OracleJob.LpExchangeRateTask.encode(message.lpExchangeRateTask, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.conditionalTask != null && Object.hasOwnProperty.call(message, "conditionalTask"))
                    $root.OracleJob.ConditionalTask.encode(message.conditionalTask, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                if (message.valueTask != null && Object.hasOwnProperty.call(message, "valueTask"))
                    $root.OracleJob.ValueTask.encode(message.valueTask, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                if (message.maxTask != null && Object.hasOwnProperty.call(message, "maxTask"))
                    $root.OracleJob.MaxTask.encode(message.maxTask, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
                if (message.regexExtractTask != null && Object.hasOwnProperty.call(message, "regexExtractTask"))
                    $root.OracleJob.RegexExtractTask.encode(message.regexExtractTask, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
                if (message.xstepPriceTask != null && Object.hasOwnProperty.call(message, "xstepPriceTask"))
                    $root.OracleJob.XStepPriceTask.encode(message.xstepPriceTask, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
                if (message.addTask != null && Object.hasOwnProperty.call(message, "addTask"))
                    $root.OracleJob.AddTask.encode(message.addTask, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
                if (message.subtractTask != null && Object.hasOwnProperty.call(message, "subtractTask"))
                    $root.OracleJob.SubtractTask.encode(message.subtractTask, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
                if (message.twapTask != null && Object.hasOwnProperty.call(message, "twapTask"))
                    $root.OracleJob.TwapTask.encode(message.twapTask, writer.uint32(/* id 18, wireType 2 =*/146).fork()).ldelim();
                if (message.serumSwapTask != null && Object.hasOwnProperty.call(message, "serumSwapTask"))
                    $root.OracleJob.SerumSwapTask.encode(message.serumSwapTask, writer.uint32(/* id 19, wireType 2 =*/154).fork()).ldelim();
                if (message.powTask != null && Object.hasOwnProperty.call(message, "powTask"))
                    $root.OracleJob.PowTask.encode(message.powTask, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
                if (message.lendingRateTask != null && Object.hasOwnProperty.call(message, "lendingRateTask"))
                    $root.OracleJob.LendingRateTask.encode(message.lendingRateTask, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
                if (message.mangoPerpMarketTask != null && Object.hasOwnProperty.call(message, "mangoPerpMarketTask"))
                    $root.OracleJob.MangoPerpMarketTask.encode(message.mangoPerpMarketTask, writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
                if (message.jupiterSwapTask != null && Object.hasOwnProperty.call(message, "jupiterSwapTask"))
                    $root.OracleJob.JupiterSwapTask.encode(message.jupiterSwapTask, writer.uint32(/* id 23, wireType 2 =*/186).fork()).ldelim();
                if (message.perpMarketTask != null && Object.hasOwnProperty.call(message, "perpMarketTask"))
                    $root.OracleJob.PerpMarketTask.encode(message.perpMarketTask, writer.uint32(/* id 24, wireType 2 =*/194).fork()).ldelim();
                if (message.oracleTask != null && Object.hasOwnProperty.call(message, "oracleTask"))
                    $root.OracleJob.OracleTask.encode(message.oracleTask, writer.uint32(/* id 25, wireType 2 =*/202).fork()).ldelim();
                if (message.anchorFetchTask != null && Object.hasOwnProperty.call(message, "anchorFetchTask"))
                    $root.OracleJob.AnchorFetchTask.encode(message.anchorFetchTask, writer.uint32(/* id 26, wireType 2 =*/210).fork()).ldelim();
                if (message.defiKingdomsTask != null && Object.hasOwnProperty.call(message, "defiKingdomsTask"))
                    $root.OracleJob.DefiKingdomsTask.encode(message.defiKingdomsTask, writer.uint32(/* id 27, wireType 2 =*/218).fork()).ldelim();
                if (message.tpsTask != null && Object.hasOwnProperty.call(message, "tpsTask"))
                    $root.OracleJob.TpsTask.encode(message.tpsTask, writer.uint32(/* id 28, wireType 2 =*/226).fork()).ldelim();
                if (message.splStakePoolTask != null && Object.hasOwnProperty.call(message, "splStakePoolTask"))
                    $root.OracleJob.SplStakePoolTask.encode(message.splStakePoolTask, writer.uint32(/* id 29, wireType 2 =*/234).fork()).ldelim();
                if (message.splTokenParseTask != null && Object.hasOwnProperty.call(message, "splTokenParseTask"))
                    $root.OracleJob.SplTokenParseTask.encode(message.splTokenParseTask, writer.uint32(/* id 30, wireType 2 =*/242).fork()).ldelim();
                if (message.uniswapExchangeRateTask != null && Object.hasOwnProperty.call(message, "uniswapExchangeRateTask"))
                    $root.OracleJob.UniswapExchangeRateTask.encode(message.uniswapExchangeRateTask, writer.uint32(/* id 31, wireType 2 =*/250).fork()).ldelim();
                if (message.sushiswapExchangeRateTask != null && Object.hasOwnProperty.call(message, "sushiswapExchangeRateTask"))
                    $root.OracleJob.SushiswapExchangeRateTask.encode(message.sushiswapExchangeRateTask, writer.uint32(/* id 32, wireType 2 =*/258).fork()).ldelim();
                if (message.pancakeswapExchangeRateTask != null && Object.hasOwnProperty.call(message, "pancakeswapExchangeRateTask"))
                    $root.OracleJob.PancakeswapExchangeRateTask.encode(message.pancakeswapExchangeRateTask, writer.uint32(/* id 33, wireType 2 =*/266).fork()).ldelim();
                if (message.cacheTask != null && Object.hasOwnProperty.call(message, "cacheTask"))
                    $root.OracleJob.CacheTask.encode(message.cacheTask, writer.uint32(/* id 34, wireType 2 =*/274).fork()).ldelim();
                if (message.sysclockOffsetTask != null && Object.hasOwnProperty.call(message, "sysclockOffsetTask"))
                    $root.OracleJob.SysclockOffsetTask.encode(message.sysclockOffsetTask, writer.uint32(/* id 35, wireType 2 =*/282).fork()).ldelim();
                if (message.marinadeStateTask != null && Object.hasOwnProperty.call(message, "marinadeStateTask"))
                    $root.OracleJob.MarinadeStateTask.encode(message.marinadeStateTask, writer.uint32(/* id 36, wireType 2 =*/290).fork()).ldelim();
                if (message.solanaAccountDataFetchTask != null && Object.hasOwnProperty.call(message, "solanaAccountDataFetchTask"))
                    $root.OracleJob.SolanaAccountDataFetchTask.encode(message.solanaAccountDataFetchTask, writer.uint32(/* id 37, wireType 2 =*/298).fork()).ldelim();
                if (message.bufferLayoutParseTask != null && Object.hasOwnProperty.call(message, "bufferLayoutParseTask"))
                    $root.OracleJob.BufferLayoutParseTask.encode(message.bufferLayoutParseTask, writer.uint32(/* id 38, wireType 2 =*/306).fork()).ldelim();
                if (message.cronParseTask != null && Object.hasOwnProperty.call(message, "cronParseTask"))
                    $root.OracleJob.CronParseTask.encode(message.cronParseTask, writer.uint32(/* id 39, wireType 2 =*/314).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified Task message, length delimited. Does not implicitly {@link OracleJob.Task.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.Task
             * @static
             * @param {OracleJob.ITask} message Task message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Task.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a Task message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.Task
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.Task} Task
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Task.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.Task();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.httpTask = $root.OracleJob.HttpTask.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.jsonParseTask = $root.OracleJob.JsonParseTask.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.medianTask = $root.OracleJob.MedianTask.decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.meanTask = $root.OracleJob.MeanTask.decode(reader, reader.uint32());
                        break;
                    case 6:
                        message.websocketTask = $root.OracleJob.WebsocketTask.decode(reader, reader.uint32());
                        break;
                    case 7:
                        message.divideTask = $root.OracleJob.DivideTask.decode(reader, reader.uint32());
                        break;
                    case 8:
                        message.multiplyTask = $root.OracleJob.MultiplyTask.decode(reader, reader.uint32());
                        break;
                    case 9:
                        message.lpTokenPriceTask = $root.OracleJob.LpTokenPriceTask.decode(reader, reader.uint32());
                        break;
                    case 10:
                        message.lpExchangeRateTask = $root.OracleJob.LpExchangeRateTask.decode(reader, reader.uint32());
                        break;
                    case 11:
                        message.conditionalTask = $root.OracleJob.ConditionalTask.decode(reader, reader.uint32());
                        break;
                    case 12:
                        message.valueTask = $root.OracleJob.ValueTask.decode(reader, reader.uint32());
                        break;
                    case 13:
                        message.maxTask = $root.OracleJob.MaxTask.decode(reader, reader.uint32());
                        break;
                    case 14:
                        message.regexExtractTask = $root.OracleJob.RegexExtractTask.decode(reader, reader.uint32());
                        break;
                    case 15:
                        message.xstepPriceTask = $root.OracleJob.XStepPriceTask.decode(reader, reader.uint32());
                        break;
                    case 16:
                        message.addTask = $root.OracleJob.AddTask.decode(reader, reader.uint32());
                        break;
                    case 17:
                        message.subtractTask = $root.OracleJob.SubtractTask.decode(reader, reader.uint32());
                        break;
                    case 18:
                        message.twapTask = $root.OracleJob.TwapTask.decode(reader, reader.uint32());
                        break;
                    case 19:
                        message.serumSwapTask = $root.OracleJob.SerumSwapTask.decode(reader, reader.uint32());
                        break;
                    case 20:
                        message.powTask = $root.OracleJob.PowTask.decode(reader, reader.uint32());
                        break;
                    case 21:
                        message.lendingRateTask = $root.OracleJob.LendingRateTask.decode(reader, reader.uint32());
                        break;
                    case 22:
                        message.mangoPerpMarketTask = $root.OracleJob.MangoPerpMarketTask.decode(reader, reader.uint32());
                        break;
                    case 23:
                        message.jupiterSwapTask = $root.OracleJob.JupiterSwapTask.decode(reader, reader.uint32());
                        break;
                    case 24:
                        message.perpMarketTask = $root.OracleJob.PerpMarketTask.decode(reader, reader.uint32());
                        break;
                    case 25:
                        message.oracleTask = $root.OracleJob.OracleTask.decode(reader, reader.uint32());
                        break;
                    case 26:
                        message.anchorFetchTask = $root.OracleJob.AnchorFetchTask.decode(reader, reader.uint32());
                        break;
                    case 27:
                        message.defiKingdomsTask = $root.OracleJob.DefiKingdomsTask.decode(reader, reader.uint32());
                        break;
                    case 28:
                        message.tpsTask = $root.OracleJob.TpsTask.decode(reader, reader.uint32());
                        break;
                    case 29:
                        message.splStakePoolTask = $root.OracleJob.SplStakePoolTask.decode(reader, reader.uint32());
                        break;
                    case 30:
                        message.splTokenParseTask = $root.OracleJob.SplTokenParseTask.decode(reader, reader.uint32());
                        break;
                    case 31:
                        message.uniswapExchangeRateTask = $root.OracleJob.UniswapExchangeRateTask.decode(reader, reader.uint32());
                        break;
                    case 32:
                        message.sushiswapExchangeRateTask = $root.OracleJob.SushiswapExchangeRateTask.decode(reader, reader.uint32());
                        break;
                    case 33:
                        message.pancakeswapExchangeRateTask = $root.OracleJob.PancakeswapExchangeRateTask.decode(reader, reader.uint32());
                        break;
                    case 34:
                        message.cacheTask = $root.OracleJob.CacheTask.decode(reader, reader.uint32());
                        break;
                    case 35:
                        message.sysclockOffsetTask = $root.OracleJob.SysclockOffsetTask.decode(reader, reader.uint32());
                        break;
                    case 36:
                        message.marinadeStateTask = $root.OracleJob.MarinadeStateTask.decode(reader, reader.uint32());
                        break;
                    case 37:
                        message.solanaAccountDataFetchTask = $root.OracleJob.SolanaAccountDataFetchTask.decode(reader, reader.uint32());
                        break;
                    case 38:
                        message.bufferLayoutParseTask = $root.OracleJob.BufferLayoutParseTask.decode(reader, reader.uint32());
                        break;
                    case 39:
                        message.cronParseTask = $root.OracleJob.CronParseTask.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a Task message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.Task
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.Task} Task
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Task.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a Task message.
             * @function verify
             * @memberof OracleJob.Task
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Task.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.httpTask != null && message.hasOwnProperty("httpTask")) {
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.HttpTask.verify(message.httpTask);
                        if (error)
                            return "httpTask." + error;
                    }
                }
                if (message.jsonParseTask != null && message.hasOwnProperty("jsonParseTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.JsonParseTask.verify(message.jsonParseTask);
                        if (error)
                            return "jsonParseTask." + error;
                    }
                }
                if (message.medianTask != null && message.hasOwnProperty("medianTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.MedianTask.verify(message.medianTask);
                        if (error)
                            return "medianTask." + error;
                    }
                }
                if (message.meanTask != null && message.hasOwnProperty("meanTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.MeanTask.verify(message.meanTask);
                        if (error)
                            return "meanTask." + error;
                    }
                }
                if (message.websocketTask != null && message.hasOwnProperty("websocketTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.WebsocketTask.verify(message.websocketTask);
                        if (error)
                            return "websocketTask." + error;
                    }
                }
                if (message.divideTask != null && message.hasOwnProperty("divideTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.DivideTask.verify(message.divideTask);
                        if (error)
                            return "divideTask." + error;
                    }
                }
                if (message.multiplyTask != null && message.hasOwnProperty("multiplyTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.MultiplyTask.verify(message.multiplyTask);
                        if (error)
                            return "multiplyTask." + error;
                    }
                }
                if (message.lpTokenPriceTask != null && message.hasOwnProperty("lpTokenPriceTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.LpTokenPriceTask.verify(message.lpTokenPriceTask);
                        if (error)
                            return "lpTokenPriceTask." + error;
                    }
                }
                if (message.lpExchangeRateTask != null && message.hasOwnProperty("lpExchangeRateTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.LpExchangeRateTask.verify(message.lpExchangeRateTask);
                        if (error)
                            return "lpExchangeRateTask." + error;
                    }
                }
                if (message.conditionalTask != null && message.hasOwnProperty("conditionalTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.ConditionalTask.verify(message.conditionalTask);
                        if (error)
                            return "conditionalTask." + error;
                    }
                }
                if (message.valueTask != null && message.hasOwnProperty("valueTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.ValueTask.verify(message.valueTask);
                        if (error)
                            return "valueTask." + error;
                    }
                }
                if (message.maxTask != null && message.hasOwnProperty("maxTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.MaxTask.verify(message.maxTask);
                        if (error)
                            return "maxTask." + error;
                    }
                }
                if (message.regexExtractTask != null && message.hasOwnProperty("regexExtractTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.RegexExtractTask.verify(message.regexExtractTask);
                        if (error)
                            return "regexExtractTask." + error;
                    }
                }
                if (message.xstepPriceTask != null && message.hasOwnProperty("xstepPriceTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.XStepPriceTask.verify(message.xstepPriceTask);
                        if (error)
                            return "xstepPriceTask." + error;
                    }
                }
                if (message.addTask != null && message.hasOwnProperty("addTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.AddTask.verify(message.addTask);
                        if (error)
                            return "addTask." + error;
                    }
                }
                if (message.subtractTask != null && message.hasOwnProperty("subtractTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.SubtractTask.verify(message.subtractTask);
                        if (error)
                            return "subtractTask." + error;
                    }
                }
                if (message.twapTask != null && message.hasOwnProperty("twapTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.TwapTask.verify(message.twapTask);
                        if (error)
                            return "twapTask." + error;
                    }
                }
                if (message.serumSwapTask != null && message.hasOwnProperty("serumSwapTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.SerumSwapTask.verify(message.serumSwapTask);
                        if (error)
                            return "serumSwapTask." + error;
                    }
                }
                if (message.powTask != null && message.hasOwnProperty("powTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.PowTask.verify(message.powTask);
                        if (error)
                            return "powTask." + error;
                    }
                }
                if (message.lendingRateTask != null && message.hasOwnProperty("lendingRateTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.LendingRateTask.verify(message.lendingRateTask);
                        if (error)
                            return "lendingRateTask." + error;
                    }
                }
                if (message.mangoPerpMarketTask != null && message.hasOwnProperty("mangoPerpMarketTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.MangoPerpMarketTask.verify(message.mangoPerpMarketTask);
                        if (error)
                            return "mangoPerpMarketTask." + error;
                    }
                }
                if (message.jupiterSwapTask != null && message.hasOwnProperty("jupiterSwapTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.JupiterSwapTask.verify(message.jupiterSwapTask);
                        if (error)
                            return "jupiterSwapTask." + error;
                    }
                }
                if (message.perpMarketTask != null && message.hasOwnProperty("perpMarketTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.PerpMarketTask.verify(message.perpMarketTask);
                        if (error)
                            return "perpMarketTask." + error;
                    }
                }
                if (message.oracleTask != null && message.hasOwnProperty("oracleTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.OracleTask.verify(message.oracleTask);
                        if (error)
                            return "oracleTask." + error;
                    }
                }
                if (message.anchorFetchTask != null && message.hasOwnProperty("anchorFetchTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.AnchorFetchTask.verify(message.anchorFetchTask);
                        if (error)
                            return "anchorFetchTask." + error;
                    }
                }
                if (message.defiKingdomsTask != null && message.hasOwnProperty("defiKingdomsTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.DefiKingdomsTask.verify(message.defiKingdomsTask);
                        if (error)
                            return "defiKingdomsTask." + error;
                    }
                }
                if (message.tpsTask != null && message.hasOwnProperty("tpsTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.TpsTask.verify(message.tpsTask);
                        if (error)
                            return "tpsTask." + error;
                    }
                }
                if (message.splStakePoolTask != null && message.hasOwnProperty("splStakePoolTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.SplStakePoolTask.verify(message.splStakePoolTask);
                        if (error)
                            return "splStakePoolTask." + error;
                    }
                }
                if (message.splTokenParseTask != null && message.hasOwnProperty("splTokenParseTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.SplTokenParseTask.verify(message.splTokenParseTask);
                        if (error)
                            return "splTokenParseTask." + error;
                    }
                }
                if (message.uniswapExchangeRateTask != null && message.hasOwnProperty("uniswapExchangeRateTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.UniswapExchangeRateTask.verify(message.uniswapExchangeRateTask);
                        if (error)
                            return "uniswapExchangeRateTask." + error;
                    }
                }
                if (message.sushiswapExchangeRateTask != null && message.hasOwnProperty("sushiswapExchangeRateTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.SushiswapExchangeRateTask.verify(message.sushiswapExchangeRateTask);
                        if (error)
                            return "sushiswapExchangeRateTask." + error;
                    }
                }
                if (message.pancakeswapExchangeRateTask != null && message.hasOwnProperty("pancakeswapExchangeRateTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.PancakeswapExchangeRateTask.verify(message.pancakeswapExchangeRateTask);
                        if (error)
                            return "pancakeswapExchangeRateTask." + error;
                    }
                }
                if (message.cacheTask != null && message.hasOwnProperty("cacheTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.CacheTask.verify(message.cacheTask);
                        if (error)
                            return "cacheTask." + error;
                    }
                }
                if (message.sysclockOffsetTask != null && message.hasOwnProperty("sysclockOffsetTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.SysclockOffsetTask.verify(message.sysclockOffsetTask);
                        if (error)
                            return "sysclockOffsetTask." + error;
                    }
                }
                if (message.marinadeStateTask != null && message.hasOwnProperty("marinadeStateTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.MarinadeStateTask.verify(message.marinadeStateTask);
                        if (error)
                            return "marinadeStateTask." + error;
                    }
                }
                if (message.solanaAccountDataFetchTask != null && message.hasOwnProperty("solanaAccountDataFetchTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.SolanaAccountDataFetchTask.verify(message.solanaAccountDataFetchTask);
                        if (error)
                            return "solanaAccountDataFetchTask." + error;
                    }
                }
                if (message.bufferLayoutParseTask != null && message.hasOwnProperty("bufferLayoutParseTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.BufferLayoutParseTask.verify(message.bufferLayoutParseTask);
                        if (error)
                            return "bufferLayoutParseTask." + error;
                    }
                }
                if (message.cronParseTask != null && message.hasOwnProperty("cronParseTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.CronParseTask.verify(message.cronParseTask);
                        if (error)
                            return "cronParseTask." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a Task message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.Task
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.Task} Task
             */
            Task.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.Task)
                    return object;
                var message = new $root.OracleJob.Task();
                if (object.httpTask != null) {
                    if (typeof object.httpTask !== "object")
                        throw TypeError(".OracleJob.Task.httpTask: object expected");
                    message.httpTask = $root.OracleJob.HttpTask.fromObject(object.httpTask);
                }
                if (object.jsonParseTask != null) {
                    if (typeof object.jsonParseTask !== "object")
                        throw TypeError(".OracleJob.Task.jsonParseTask: object expected");
                    message.jsonParseTask = $root.OracleJob.JsonParseTask.fromObject(object.jsonParseTask);
                }
                if (object.medianTask != null) {
                    if (typeof object.medianTask !== "object")
                        throw TypeError(".OracleJob.Task.medianTask: object expected");
                    message.medianTask = $root.OracleJob.MedianTask.fromObject(object.medianTask);
                }
                if (object.meanTask != null) {
                    if (typeof object.meanTask !== "object")
                        throw TypeError(".OracleJob.Task.meanTask: object expected");
                    message.meanTask = $root.OracleJob.MeanTask.fromObject(object.meanTask);
                }
                if (object.websocketTask != null) {
                    if (typeof object.websocketTask !== "object")
                        throw TypeError(".OracleJob.Task.websocketTask: object expected");
                    message.websocketTask = $root.OracleJob.WebsocketTask.fromObject(object.websocketTask);
                }
                if (object.divideTask != null) {
                    if (typeof object.divideTask !== "object")
                        throw TypeError(".OracleJob.Task.divideTask: object expected");
                    message.divideTask = $root.OracleJob.DivideTask.fromObject(object.divideTask);
                }
                if (object.multiplyTask != null) {
                    if (typeof object.multiplyTask !== "object")
                        throw TypeError(".OracleJob.Task.multiplyTask: object expected");
                    message.multiplyTask = $root.OracleJob.MultiplyTask.fromObject(object.multiplyTask);
                }
                if (object.lpTokenPriceTask != null) {
                    if (typeof object.lpTokenPriceTask !== "object")
                        throw TypeError(".OracleJob.Task.lpTokenPriceTask: object expected");
                    message.lpTokenPriceTask = $root.OracleJob.LpTokenPriceTask.fromObject(object.lpTokenPriceTask);
                }
                if (object.lpExchangeRateTask != null) {
                    if (typeof object.lpExchangeRateTask !== "object")
                        throw TypeError(".OracleJob.Task.lpExchangeRateTask: object expected");
                    message.lpExchangeRateTask = $root.OracleJob.LpExchangeRateTask.fromObject(object.lpExchangeRateTask);
                }
                if (object.conditionalTask != null) {
                    if (typeof object.conditionalTask !== "object")
                        throw TypeError(".OracleJob.Task.conditionalTask: object expected");
                    message.conditionalTask = $root.OracleJob.ConditionalTask.fromObject(object.conditionalTask);
                }
                if (object.valueTask != null) {
                    if (typeof object.valueTask !== "object")
                        throw TypeError(".OracleJob.Task.valueTask: object expected");
                    message.valueTask = $root.OracleJob.ValueTask.fromObject(object.valueTask);
                }
                if (object.maxTask != null) {
                    if (typeof object.maxTask !== "object")
                        throw TypeError(".OracleJob.Task.maxTask: object expected");
                    message.maxTask = $root.OracleJob.MaxTask.fromObject(object.maxTask);
                }
                if (object.regexExtractTask != null) {
                    if (typeof object.regexExtractTask !== "object")
                        throw TypeError(".OracleJob.Task.regexExtractTask: object expected");
                    message.regexExtractTask = $root.OracleJob.RegexExtractTask.fromObject(object.regexExtractTask);
                }
                if (object.xstepPriceTask != null) {
                    if (typeof object.xstepPriceTask !== "object")
                        throw TypeError(".OracleJob.Task.xstepPriceTask: object expected");
                    message.xstepPriceTask = $root.OracleJob.XStepPriceTask.fromObject(object.xstepPriceTask);
                }
                if (object.addTask != null) {
                    if (typeof object.addTask !== "object")
                        throw TypeError(".OracleJob.Task.addTask: object expected");
                    message.addTask = $root.OracleJob.AddTask.fromObject(object.addTask);
                }
                if (object.subtractTask != null) {
                    if (typeof object.subtractTask !== "object")
                        throw TypeError(".OracleJob.Task.subtractTask: object expected");
                    message.subtractTask = $root.OracleJob.SubtractTask.fromObject(object.subtractTask);
                }
                if (object.twapTask != null) {
                    if (typeof object.twapTask !== "object")
                        throw TypeError(".OracleJob.Task.twapTask: object expected");
                    message.twapTask = $root.OracleJob.TwapTask.fromObject(object.twapTask);
                }
                if (object.serumSwapTask != null) {
                    if (typeof object.serumSwapTask !== "object")
                        throw TypeError(".OracleJob.Task.serumSwapTask: object expected");
                    message.serumSwapTask = $root.OracleJob.SerumSwapTask.fromObject(object.serumSwapTask);
                }
                if (object.powTask != null) {
                    if (typeof object.powTask !== "object")
                        throw TypeError(".OracleJob.Task.powTask: object expected");
                    message.powTask = $root.OracleJob.PowTask.fromObject(object.powTask);
                }
                if (object.lendingRateTask != null) {
                    if (typeof object.lendingRateTask !== "object")
                        throw TypeError(".OracleJob.Task.lendingRateTask: object expected");
                    message.lendingRateTask = $root.OracleJob.LendingRateTask.fromObject(object.lendingRateTask);
                }
                if (object.mangoPerpMarketTask != null) {
                    if (typeof object.mangoPerpMarketTask !== "object")
                        throw TypeError(".OracleJob.Task.mangoPerpMarketTask: object expected");
                    message.mangoPerpMarketTask = $root.OracleJob.MangoPerpMarketTask.fromObject(object.mangoPerpMarketTask);
                }
                if (object.jupiterSwapTask != null) {
                    if (typeof object.jupiterSwapTask !== "object")
                        throw TypeError(".OracleJob.Task.jupiterSwapTask: object expected");
                    message.jupiterSwapTask = $root.OracleJob.JupiterSwapTask.fromObject(object.jupiterSwapTask);
                }
                if (object.perpMarketTask != null) {
                    if (typeof object.perpMarketTask !== "object")
                        throw TypeError(".OracleJob.Task.perpMarketTask: object expected");
                    message.perpMarketTask = $root.OracleJob.PerpMarketTask.fromObject(object.perpMarketTask);
                }
                if (object.oracleTask != null) {
                    if (typeof object.oracleTask !== "object")
                        throw TypeError(".OracleJob.Task.oracleTask: object expected");
                    message.oracleTask = $root.OracleJob.OracleTask.fromObject(object.oracleTask);
                }
                if (object.anchorFetchTask != null) {
                    if (typeof object.anchorFetchTask !== "object")
                        throw TypeError(".OracleJob.Task.anchorFetchTask: object expected");
                    message.anchorFetchTask = $root.OracleJob.AnchorFetchTask.fromObject(object.anchorFetchTask);
                }
                if (object.defiKingdomsTask != null) {
                    if (typeof object.defiKingdomsTask !== "object")
                        throw TypeError(".OracleJob.Task.defiKingdomsTask: object expected");
                    message.defiKingdomsTask = $root.OracleJob.DefiKingdomsTask.fromObject(object.defiKingdomsTask);
                }
                if (object.tpsTask != null) {
                    if (typeof object.tpsTask !== "object")
                        throw TypeError(".OracleJob.Task.tpsTask: object expected");
                    message.tpsTask = $root.OracleJob.TpsTask.fromObject(object.tpsTask);
                }
                if (object.splStakePoolTask != null) {
                    if (typeof object.splStakePoolTask !== "object")
                        throw TypeError(".OracleJob.Task.splStakePoolTask: object expected");
                    message.splStakePoolTask = $root.OracleJob.SplStakePoolTask.fromObject(object.splStakePoolTask);
                }
                if (object.splTokenParseTask != null) {
                    if (typeof object.splTokenParseTask !== "object")
                        throw TypeError(".OracleJob.Task.splTokenParseTask: object expected");
                    message.splTokenParseTask = $root.OracleJob.SplTokenParseTask.fromObject(object.splTokenParseTask);
                }
                if (object.uniswapExchangeRateTask != null) {
                    if (typeof object.uniswapExchangeRateTask !== "object")
                        throw TypeError(".OracleJob.Task.uniswapExchangeRateTask: object expected");
                    message.uniswapExchangeRateTask = $root.OracleJob.UniswapExchangeRateTask.fromObject(object.uniswapExchangeRateTask);
                }
                if (object.sushiswapExchangeRateTask != null) {
                    if (typeof object.sushiswapExchangeRateTask !== "object")
                        throw TypeError(".OracleJob.Task.sushiswapExchangeRateTask: object expected");
                    message.sushiswapExchangeRateTask = $root.OracleJob.SushiswapExchangeRateTask.fromObject(object.sushiswapExchangeRateTask);
                }
                if (object.pancakeswapExchangeRateTask != null) {
                    if (typeof object.pancakeswapExchangeRateTask !== "object")
                        throw TypeError(".OracleJob.Task.pancakeswapExchangeRateTask: object expected");
                    message.pancakeswapExchangeRateTask = $root.OracleJob.PancakeswapExchangeRateTask.fromObject(object.pancakeswapExchangeRateTask);
                }
                if (object.cacheTask != null) {
                    if (typeof object.cacheTask !== "object")
                        throw TypeError(".OracleJob.Task.cacheTask: object expected");
                    message.cacheTask = $root.OracleJob.CacheTask.fromObject(object.cacheTask);
                }
                if (object.sysclockOffsetTask != null) {
                    if (typeof object.sysclockOffsetTask !== "object")
                        throw TypeError(".OracleJob.Task.sysclockOffsetTask: object expected");
                    message.sysclockOffsetTask = $root.OracleJob.SysclockOffsetTask.fromObject(object.sysclockOffsetTask);
                }
                if (object.marinadeStateTask != null) {
                    if (typeof object.marinadeStateTask !== "object")
                        throw TypeError(".OracleJob.Task.marinadeStateTask: object expected");
                    message.marinadeStateTask = $root.OracleJob.MarinadeStateTask.fromObject(object.marinadeStateTask);
                }
                if (object.solanaAccountDataFetchTask != null) {
                    if (typeof object.solanaAccountDataFetchTask !== "object")
                        throw TypeError(".OracleJob.Task.solanaAccountDataFetchTask: object expected");
                    message.solanaAccountDataFetchTask = $root.OracleJob.SolanaAccountDataFetchTask.fromObject(object.solanaAccountDataFetchTask);
                }
                if (object.bufferLayoutParseTask != null) {
                    if (typeof object.bufferLayoutParseTask !== "object")
                        throw TypeError(".OracleJob.Task.bufferLayoutParseTask: object expected");
                    message.bufferLayoutParseTask = $root.OracleJob.BufferLayoutParseTask.fromObject(object.bufferLayoutParseTask);
                }
                if (object.cronParseTask != null) {
                    if (typeof object.cronParseTask !== "object")
                        throw TypeError(".OracleJob.Task.cronParseTask: object expected");
                    message.cronParseTask = $root.OracleJob.CronParseTask.fromObject(object.cronParseTask);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a Task message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.Task
             * @static
             * @param {OracleJob.Task} message Task
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Task.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.httpTask != null && message.hasOwnProperty("httpTask")) {
                    object.httpTask = $root.OracleJob.HttpTask.toObject(message.httpTask, options);
                    if (options.oneofs)
                        object.Task = "httpTask";
                }
                if (message.jsonParseTask != null && message.hasOwnProperty("jsonParseTask")) {
                    object.jsonParseTask = $root.OracleJob.JsonParseTask.toObject(message.jsonParseTask, options);
                    if (options.oneofs)
                        object.Task = "jsonParseTask";
                }
                if (message.medianTask != null && message.hasOwnProperty("medianTask")) {
                    object.medianTask = $root.OracleJob.MedianTask.toObject(message.medianTask, options);
                    if (options.oneofs)
                        object.Task = "medianTask";
                }
                if (message.meanTask != null && message.hasOwnProperty("meanTask")) {
                    object.meanTask = $root.OracleJob.MeanTask.toObject(message.meanTask, options);
                    if (options.oneofs)
                        object.Task = "meanTask";
                }
                if (message.websocketTask != null && message.hasOwnProperty("websocketTask")) {
                    object.websocketTask = $root.OracleJob.WebsocketTask.toObject(message.websocketTask, options);
                    if (options.oneofs)
                        object.Task = "websocketTask";
                }
                if (message.divideTask != null && message.hasOwnProperty("divideTask")) {
                    object.divideTask = $root.OracleJob.DivideTask.toObject(message.divideTask, options);
                    if (options.oneofs)
                        object.Task = "divideTask";
                }
                if (message.multiplyTask != null && message.hasOwnProperty("multiplyTask")) {
                    object.multiplyTask = $root.OracleJob.MultiplyTask.toObject(message.multiplyTask, options);
                    if (options.oneofs)
                        object.Task = "multiplyTask";
                }
                if (message.lpTokenPriceTask != null && message.hasOwnProperty("lpTokenPriceTask")) {
                    object.lpTokenPriceTask = $root.OracleJob.LpTokenPriceTask.toObject(message.lpTokenPriceTask, options);
                    if (options.oneofs)
                        object.Task = "lpTokenPriceTask";
                }
                if (message.lpExchangeRateTask != null && message.hasOwnProperty("lpExchangeRateTask")) {
                    object.lpExchangeRateTask = $root.OracleJob.LpExchangeRateTask.toObject(message.lpExchangeRateTask, options);
                    if (options.oneofs)
                        object.Task = "lpExchangeRateTask";
                }
                if (message.conditionalTask != null && message.hasOwnProperty("conditionalTask")) {
                    object.conditionalTask = $root.OracleJob.ConditionalTask.toObject(message.conditionalTask, options);
                    if (options.oneofs)
                        object.Task = "conditionalTask";
                }
                if (message.valueTask != null && message.hasOwnProperty("valueTask")) {
                    object.valueTask = $root.OracleJob.ValueTask.toObject(message.valueTask, options);
                    if (options.oneofs)
                        object.Task = "valueTask";
                }
                if (message.maxTask != null && message.hasOwnProperty("maxTask")) {
                    object.maxTask = $root.OracleJob.MaxTask.toObject(message.maxTask, options);
                    if (options.oneofs)
                        object.Task = "maxTask";
                }
                if (message.regexExtractTask != null && message.hasOwnProperty("regexExtractTask")) {
                    object.regexExtractTask = $root.OracleJob.RegexExtractTask.toObject(message.regexExtractTask, options);
                    if (options.oneofs)
                        object.Task = "regexExtractTask";
                }
                if (message.xstepPriceTask != null && message.hasOwnProperty("xstepPriceTask")) {
                    object.xstepPriceTask = $root.OracleJob.XStepPriceTask.toObject(message.xstepPriceTask, options);
                    if (options.oneofs)
                        object.Task = "xstepPriceTask";
                }
                if (message.addTask != null && message.hasOwnProperty("addTask")) {
                    object.addTask = $root.OracleJob.AddTask.toObject(message.addTask, options);
                    if (options.oneofs)
                        object.Task = "addTask";
                }
                if (message.subtractTask != null && message.hasOwnProperty("subtractTask")) {
                    object.subtractTask = $root.OracleJob.SubtractTask.toObject(message.subtractTask, options);
                    if (options.oneofs)
                        object.Task = "subtractTask";
                }
                if (message.twapTask != null && message.hasOwnProperty("twapTask")) {
                    object.twapTask = $root.OracleJob.TwapTask.toObject(message.twapTask, options);
                    if (options.oneofs)
                        object.Task = "twapTask";
                }
                if (message.serumSwapTask != null && message.hasOwnProperty("serumSwapTask")) {
                    object.serumSwapTask = $root.OracleJob.SerumSwapTask.toObject(message.serumSwapTask, options);
                    if (options.oneofs)
                        object.Task = "serumSwapTask";
                }
                if (message.powTask != null && message.hasOwnProperty("powTask")) {
                    object.powTask = $root.OracleJob.PowTask.toObject(message.powTask, options);
                    if (options.oneofs)
                        object.Task = "powTask";
                }
                if (message.lendingRateTask != null && message.hasOwnProperty("lendingRateTask")) {
                    object.lendingRateTask = $root.OracleJob.LendingRateTask.toObject(message.lendingRateTask, options);
                    if (options.oneofs)
                        object.Task = "lendingRateTask";
                }
                if (message.mangoPerpMarketTask != null && message.hasOwnProperty("mangoPerpMarketTask")) {
                    object.mangoPerpMarketTask = $root.OracleJob.MangoPerpMarketTask.toObject(message.mangoPerpMarketTask, options);
                    if (options.oneofs)
                        object.Task = "mangoPerpMarketTask";
                }
                if (message.jupiterSwapTask != null && message.hasOwnProperty("jupiterSwapTask")) {
                    object.jupiterSwapTask = $root.OracleJob.JupiterSwapTask.toObject(message.jupiterSwapTask, options);
                    if (options.oneofs)
                        object.Task = "jupiterSwapTask";
                }
                if (message.perpMarketTask != null && message.hasOwnProperty("perpMarketTask")) {
                    object.perpMarketTask = $root.OracleJob.PerpMarketTask.toObject(message.perpMarketTask, options);
                    if (options.oneofs)
                        object.Task = "perpMarketTask";
                }
                if (message.oracleTask != null && message.hasOwnProperty("oracleTask")) {
                    object.oracleTask = $root.OracleJob.OracleTask.toObject(message.oracleTask, options);
                    if (options.oneofs)
                        object.Task = "oracleTask";
                }
                if (message.anchorFetchTask != null && message.hasOwnProperty("anchorFetchTask")) {
                    object.anchorFetchTask = $root.OracleJob.AnchorFetchTask.toObject(message.anchorFetchTask, options);
                    if (options.oneofs)
                        object.Task = "anchorFetchTask";
                }
                if (message.defiKingdomsTask != null && message.hasOwnProperty("defiKingdomsTask")) {
                    object.defiKingdomsTask = $root.OracleJob.DefiKingdomsTask.toObject(message.defiKingdomsTask, options);
                    if (options.oneofs)
                        object.Task = "defiKingdomsTask";
                }
                if (message.tpsTask != null && message.hasOwnProperty("tpsTask")) {
                    object.tpsTask = $root.OracleJob.TpsTask.toObject(message.tpsTask, options);
                    if (options.oneofs)
                        object.Task = "tpsTask";
                }
                if (message.splStakePoolTask != null && message.hasOwnProperty("splStakePoolTask")) {
                    object.splStakePoolTask = $root.OracleJob.SplStakePoolTask.toObject(message.splStakePoolTask, options);
                    if (options.oneofs)
                        object.Task = "splStakePoolTask";
                }
                if (message.splTokenParseTask != null && message.hasOwnProperty("splTokenParseTask")) {
                    object.splTokenParseTask = $root.OracleJob.SplTokenParseTask.toObject(message.splTokenParseTask, options);
                    if (options.oneofs)
                        object.Task = "splTokenParseTask";
                }
                if (message.uniswapExchangeRateTask != null && message.hasOwnProperty("uniswapExchangeRateTask")) {
                    object.uniswapExchangeRateTask = $root.OracleJob.UniswapExchangeRateTask.toObject(message.uniswapExchangeRateTask, options);
                    if (options.oneofs)
                        object.Task = "uniswapExchangeRateTask";
                }
                if (message.sushiswapExchangeRateTask != null && message.hasOwnProperty("sushiswapExchangeRateTask")) {
                    object.sushiswapExchangeRateTask = $root.OracleJob.SushiswapExchangeRateTask.toObject(message.sushiswapExchangeRateTask, options);
                    if (options.oneofs)
                        object.Task = "sushiswapExchangeRateTask";
                }
                if (message.pancakeswapExchangeRateTask != null && message.hasOwnProperty("pancakeswapExchangeRateTask")) {
                    object.pancakeswapExchangeRateTask = $root.OracleJob.PancakeswapExchangeRateTask.toObject(message.pancakeswapExchangeRateTask, options);
                    if (options.oneofs)
                        object.Task = "pancakeswapExchangeRateTask";
                }
                if (message.cacheTask != null && message.hasOwnProperty("cacheTask")) {
                    object.cacheTask = $root.OracleJob.CacheTask.toObject(message.cacheTask, options);
                    if (options.oneofs)
                        object.Task = "cacheTask";
                }
                if (message.sysclockOffsetTask != null && message.hasOwnProperty("sysclockOffsetTask")) {
                    object.sysclockOffsetTask = $root.OracleJob.SysclockOffsetTask.toObject(message.sysclockOffsetTask, options);
                    if (options.oneofs)
                        object.Task = "sysclockOffsetTask";
                }
                if (message.marinadeStateTask != null && message.hasOwnProperty("marinadeStateTask")) {
                    object.marinadeStateTask = $root.OracleJob.MarinadeStateTask.toObject(message.marinadeStateTask, options);
                    if (options.oneofs)
                        object.Task = "marinadeStateTask";
                }
                if (message.solanaAccountDataFetchTask != null && message.hasOwnProperty("solanaAccountDataFetchTask")) {
                    object.solanaAccountDataFetchTask = $root.OracleJob.SolanaAccountDataFetchTask.toObject(message.solanaAccountDataFetchTask, options);
                    if (options.oneofs)
                        object.Task = "solanaAccountDataFetchTask";
                }
                if (message.bufferLayoutParseTask != null && message.hasOwnProperty("bufferLayoutParseTask")) {
                    object.bufferLayoutParseTask = $root.OracleJob.BufferLayoutParseTask.toObject(message.bufferLayoutParseTask, options);
                    if (options.oneofs)
                        object.Task = "bufferLayoutParseTask";
                }
                if (message.cronParseTask != null && message.hasOwnProperty("cronParseTask")) {
                    object.cronParseTask = $root.OracleJob.CronParseTask.toObject(message.cronParseTask, options);
                    if (options.oneofs)
                        object.Task = "cronParseTask";
                }
                return object;
            };
    
            /**
             * Converts this Task to JSON.
             * @function toJSON
             * @memberof OracleJob.Task
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Task.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return Task;
        })();
    
        return OracleJob;
    })();

    return $root;
});
