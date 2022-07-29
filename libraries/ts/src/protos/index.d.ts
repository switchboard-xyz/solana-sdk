import * as $protobuf from "protobufjs";
/** Properties of an OracleJob. */
export interface IOracleJob {

    /** OracleJob tasks */
    tasks?: (OracleJob.ITask[]|null);
}

/** Represents an OracleJob. */
export class OracleJob implements IOracleJob {

    /**
     * Constructs a new OracleJob.
     * @param [properties] Properties to set
     */
    constructor(properties?: IOracleJob);

    /** OracleJob tasks. */
    public tasks: OracleJob.ITask[];

    /**
     * Creates a new OracleJob instance using the specified properties.
     * @param [properties] Properties to set
     * @returns OracleJob instance
     */
    public static create(properties?: IOracleJob): OracleJob;

    /**
     * Encodes the specified OracleJob message. Does not implicitly {@link OracleJob.verify|verify} messages.
     * @param message OracleJob message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IOracleJob, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified OracleJob message, length delimited. Does not implicitly {@link OracleJob.verify|verify} messages.
     * @param message OracleJob message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IOracleJob, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an OracleJob message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns OracleJob
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob;

    /**
     * Decodes an OracleJob message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns OracleJob
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob;

    /**
     * Verifies an OracleJob message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an OracleJob message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns OracleJob
     */
    public static fromObject(object: { [k: string]: any }): OracleJob;

    /**
     * Creates a plain object from an OracleJob message. Also converts values to other types if specified.
     * @param message OracleJob
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: OracleJob, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this OracleJob to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace OracleJob {

    /** Properties of a HttpTask. */
    interface IHttpTask {

        /** HttpTask url */
        url?: (string|null);

        /** HttpTask method */
        method?: (OracleJob.HttpTask.Method|null);

        /** HttpTask headers */
        headers?: (OracleJob.HttpTask.IHeader[]|null);

        /** HttpTask body */
        body?: (string|null);
    }

    /** Represents a HttpTask. */
    class HttpTask implements IHttpTask {

        /**
         * Constructs a new HttpTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IHttpTask);

        /** HttpTask url. */
        public url: string;

        /** HttpTask method. */
        public method: OracleJob.HttpTask.Method;

        /** HttpTask headers. */
        public headers: OracleJob.HttpTask.IHeader[];

        /** HttpTask body. */
        public body: string;

        /**
         * Creates a new HttpTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HttpTask instance
         */
        public static create(properties?: OracleJob.IHttpTask): OracleJob.HttpTask;

        /**
         * Encodes the specified HttpTask message. Does not implicitly {@link OracleJob.HttpTask.verify|verify} messages.
         * @param message HttpTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IHttpTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HttpTask message, length delimited. Does not implicitly {@link OracleJob.HttpTask.verify|verify} messages.
         * @param message HttpTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IHttpTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HttpTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HttpTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.HttpTask;

        /**
         * Decodes a HttpTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HttpTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.HttpTask;

        /**
         * Verifies a HttpTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HttpTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HttpTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.HttpTask;

        /**
         * Creates a plain object from a HttpTask message. Also converts values to other types if specified.
         * @param message HttpTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.HttpTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HttpTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace HttpTask {

        /** Method enum. */
        enum Method {
            METHOD_UNKOWN = 0,
            METHOD_GET = 1,
            METHOD_POST = 2
        }

        /** Properties of a Header. */
        interface IHeader {

            /** Header key */
            key?: (string|null);

            /** Header value */
            value?: (string|null);
        }

        /** Represents a Header. */
        class Header implements IHeader {

            /**
             * Constructs a new Header.
             * @param [properties] Properties to set
             */
            constructor(properties?: OracleJob.HttpTask.IHeader);

            /** Header key. */
            public key: string;

            /** Header value. */
            public value: string;

            /**
             * Creates a new Header instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Header instance
             */
            public static create(properties?: OracleJob.HttpTask.IHeader): OracleJob.HttpTask.Header;

            /**
             * Encodes the specified Header message. Does not implicitly {@link OracleJob.HttpTask.Header.verify|verify} messages.
             * @param message Header message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: OracleJob.HttpTask.IHeader, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Header message, length delimited. Does not implicitly {@link OracleJob.HttpTask.Header.verify|verify} messages.
             * @param message Header message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: OracleJob.HttpTask.IHeader, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Header message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Header
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.HttpTask.Header;

            /**
             * Decodes a Header message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Header
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.HttpTask.Header;

            /**
             * Verifies a Header message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Header message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Header
             */
            public static fromObject(object: { [k: string]: any }): OracleJob.HttpTask.Header;

            /**
             * Creates a plain object from a Header message. Also converts values to other types if specified.
             * @param message Header
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: OracleJob.HttpTask.Header, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Header to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of a JsonParseTask. */
    interface IJsonParseTask {

        /** JsonParseTask path */
        path?: (string|null);

        /** JsonParseTask aggregationMethod */
        aggregationMethod?: (OracleJob.JsonParseTask.AggregationMethod|null);
    }

    /** Represents a JsonParseTask. */
    class JsonParseTask implements IJsonParseTask {

        /**
         * Constructs a new JsonParseTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IJsonParseTask);

        /** JsonParseTask path. */
        public path: string;

        /** JsonParseTask aggregationMethod. */
        public aggregationMethod: OracleJob.JsonParseTask.AggregationMethod;

        /**
         * Creates a new JsonParseTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JsonParseTask instance
         */
        public static create(properties?: OracleJob.IJsonParseTask): OracleJob.JsonParseTask;

        /**
         * Encodes the specified JsonParseTask message. Does not implicitly {@link OracleJob.JsonParseTask.verify|verify} messages.
         * @param message JsonParseTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IJsonParseTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified JsonParseTask message, length delimited. Does not implicitly {@link OracleJob.JsonParseTask.verify|verify} messages.
         * @param message JsonParseTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IJsonParseTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JsonParseTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JsonParseTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.JsonParseTask;

        /**
         * Decodes a JsonParseTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JsonParseTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.JsonParseTask;

        /**
         * Verifies a JsonParseTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a JsonParseTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns JsonParseTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.JsonParseTask;

        /**
         * Creates a plain object from a JsonParseTask message. Also converts values to other types if specified.
         * @param message JsonParseTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.JsonParseTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this JsonParseTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace JsonParseTask {

        /** AggregationMethod enum. */
        enum AggregationMethod {
            NONE = 0,
            MIN = 1,
            MAX = 2,
            SUM = 3,
            MEAN = 4,
            MEDIAN = 5
        }
    }

    /** Properties of a MedianTask. */
    interface IMedianTask {

        /** MedianTask tasks */
        tasks?: (OracleJob.ITask[]|null);

        /** MedianTask jobs */
        jobs?: (IOracleJob[]|null);

        /** MedianTask minSuccessfulRequired */
        minSuccessfulRequired?: (number|null);
    }

    /** Represents a MedianTask. */
    class MedianTask implements IMedianTask {

        /**
         * Constructs a new MedianTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IMedianTask);

        /** MedianTask tasks. */
        public tasks: OracleJob.ITask[];

        /** MedianTask jobs. */
        public jobs: IOracleJob[];

        /** MedianTask minSuccessfulRequired. */
        public minSuccessfulRequired: number;

        /**
         * Creates a new MedianTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MedianTask instance
         */
        public static create(properties?: OracleJob.IMedianTask): OracleJob.MedianTask;

        /**
         * Encodes the specified MedianTask message. Does not implicitly {@link OracleJob.MedianTask.verify|verify} messages.
         * @param message MedianTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IMedianTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MedianTask message, length delimited. Does not implicitly {@link OracleJob.MedianTask.verify|verify} messages.
         * @param message MedianTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IMedianTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MedianTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MedianTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.MedianTask;

        /**
         * Decodes a MedianTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MedianTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.MedianTask;

        /**
         * Verifies a MedianTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MedianTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MedianTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.MedianTask;

        /**
         * Creates a plain object from a MedianTask message. Also converts values to other types if specified.
         * @param message MedianTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.MedianTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MedianTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MeanTask. */
    interface IMeanTask {

        /** MeanTask tasks */
        tasks?: (OracleJob.ITask[]|null);

        /** MeanTask jobs */
        jobs?: (IOracleJob[]|null);
    }

    /** Represents a MeanTask. */
    class MeanTask implements IMeanTask {

        /**
         * Constructs a new MeanTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IMeanTask);

        /** MeanTask tasks. */
        public tasks: OracleJob.ITask[];

        /** MeanTask jobs. */
        public jobs: IOracleJob[];

        /**
         * Creates a new MeanTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MeanTask instance
         */
        public static create(properties?: OracleJob.IMeanTask): OracleJob.MeanTask;

        /**
         * Encodes the specified MeanTask message. Does not implicitly {@link OracleJob.MeanTask.verify|verify} messages.
         * @param message MeanTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IMeanTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MeanTask message, length delimited. Does not implicitly {@link OracleJob.MeanTask.verify|verify} messages.
         * @param message MeanTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IMeanTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MeanTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MeanTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.MeanTask;

        /**
         * Decodes a MeanTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MeanTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.MeanTask;

        /**
         * Verifies a MeanTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MeanTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MeanTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.MeanTask;

        /**
         * Creates a plain object from a MeanTask message. Also converts values to other types if specified.
         * @param message MeanTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.MeanTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MeanTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MaxTask. */
    interface IMaxTask {

        /** MaxTask tasks */
        tasks?: (OracleJob.ITask[]|null);

        /** MaxTask jobs */
        jobs?: (IOracleJob[]|null);
    }

    /** Represents a MaxTask. */
    class MaxTask implements IMaxTask {

        /**
         * Constructs a new MaxTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IMaxTask);

        /** MaxTask tasks. */
        public tasks: OracleJob.ITask[];

        /** MaxTask jobs. */
        public jobs: IOracleJob[];

        /**
         * Creates a new MaxTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MaxTask instance
         */
        public static create(properties?: OracleJob.IMaxTask): OracleJob.MaxTask;

        /**
         * Encodes the specified MaxTask message. Does not implicitly {@link OracleJob.MaxTask.verify|verify} messages.
         * @param message MaxTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IMaxTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MaxTask message, length delimited. Does not implicitly {@link OracleJob.MaxTask.verify|verify} messages.
         * @param message MaxTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IMaxTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MaxTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MaxTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.MaxTask;

        /**
         * Decodes a MaxTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MaxTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.MaxTask;

        /**
         * Verifies a MaxTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MaxTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MaxTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.MaxTask;

        /**
         * Creates a plain object from a MaxTask message. Also converts values to other types if specified.
         * @param message MaxTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.MaxTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MaxTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ValueTask. */
    interface IValueTask {

        /** ValueTask value */
        value?: (number|null);

        /** ValueTask aggregatorPubkey */
        aggregatorPubkey?: (string|null);

        /** ValueTask big */
        big?: (string|null);
    }

    /** Represents a ValueTask. */
    class ValueTask implements IValueTask {

        /**
         * Constructs a new ValueTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IValueTask);

        /** ValueTask value. */
        public value?: (number|null);

        /** ValueTask aggregatorPubkey. */
        public aggregatorPubkey?: (string|null);

        /** ValueTask big. */
        public big?: (string|null);

        /** ValueTask Value. */
        public Value?: ("value"|"aggregatorPubkey"|"big");

        /**
         * Creates a new ValueTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ValueTask instance
         */
        public static create(properties?: OracleJob.IValueTask): OracleJob.ValueTask;

        /**
         * Encodes the specified ValueTask message. Does not implicitly {@link OracleJob.ValueTask.verify|verify} messages.
         * @param message ValueTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IValueTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ValueTask message, length delimited. Does not implicitly {@link OracleJob.ValueTask.verify|verify} messages.
         * @param message ValueTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IValueTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ValueTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ValueTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.ValueTask;

        /**
         * Decodes a ValueTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ValueTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.ValueTask;

        /**
         * Verifies a ValueTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ValueTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ValueTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.ValueTask;

        /**
         * Creates a plain object from a ValueTask message. Also converts values to other types if specified.
         * @param message ValueTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.ValueTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ValueTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a WebsocketTask. */
    interface IWebsocketTask {

        /** WebsocketTask url */
        url?: (string|null);

        /** WebsocketTask subscription */
        subscription?: (string|null);

        /** WebsocketTask maxDataAgeSeconds */
        maxDataAgeSeconds?: (number|null);

        /** WebsocketTask filter */
        filter?: (string|null);
    }

    /** Represents a WebsocketTask. */
    class WebsocketTask implements IWebsocketTask {

        /**
         * Constructs a new WebsocketTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IWebsocketTask);

        /** WebsocketTask url. */
        public url: string;

        /** WebsocketTask subscription. */
        public subscription: string;

        /** WebsocketTask maxDataAgeSeconds. */
        public maxDataAgeSeconds: number;

        /** WebsocketTask filter. */
        public filter: string;

        /**
         * Creates a new WebsocketTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WebsocketTask instance
         */
        public static create(properties?: OracleJob.IWebsocketTask): OracleJob.WebsocketTask;

        /**
         * Encodes the specified WebsocketTask message. Does not implicitly {@link OracleJob.WebsocketTask.verify|verify} messages.
         * @param message WebsocketTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IWebsocketTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WebsocketTask message, length delimited. Does not implicitly {@link OracleJob.WebsocketTask.verify|verify} messages.
         * @param message WebsocketTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IWebsocketTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WebsocketTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WebsocketTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.WebsocketTask;

        /**
         * Decodes a WebsocketTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WebsocketTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.WebsocketTask;

        /**
         * Verifies a WebsocketTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WebsocketTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WebsocketTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.WebsocketTask;

        /**
         * Creates a plain object from a WebsocketTask message. Also converts values to other types if specified.
         * @param message WebsocketTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.WebsocketTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WebsocketTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ConditionalTask. */
    interface IConditionalTask {

        /** ConditionalTask attempt */
        attempt?: (OracleJob.ITask[]|null);

        /** ConditionalTask onFailure */
        onFailure?: (OracleJob.ITask[]|null);
    }

    /** Represents a ConditionalTask. */
    class ConditionalTask implements IConditionalTask {

        /**
         * Constructs a new ConditionalTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IConditionalTask);

        /** ConditionalTask attempt. */
        public attempt: OracleJob.ITask[];

        /** ConditionalTask onFailure. */
        public onFailure: OracleJob.ITask[];

        /**
         * Creates a new ConditionalTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ConditionalTask instance
         */
        public static create(properties?: OracleJob.IConditionalTask): OracleJob.ConditionalTask;

        /**
         * Encodes the specified ConditionalTask message. Does not implicitly {@link OracleJob.ConditionalTask.verify|verify} messages.
         * @param message ConditionalTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IConditionalTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ConditionalTask message, length delimited. Does not implicitly {@link OracleJob.ConditionalTask.verify|verify} messages.
         * @param message ConditionalTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IConditionalTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ConditionalTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ConditionalTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.ConditionalTask;

        /**
         * Decodes a ConditionalTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ConditionalTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.ConditionalTask;

        /**
         * Verifies a ConditionalTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ConditionalTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ConditionalTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.ConditionalTask;

        /**
         * Creates a plain object from a ConditionalTask message. Also converts values to other types if specified.
         * @param message ConditionalTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.ConditionalTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ConditionalTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DivideTask. */
    interface IDivideTask {

        /** DivideTask scalar */
        scalar?: (number|null);

        /** DivideTask aggregatorPubkey */
        aggregatorPubkey?: (string|null);

        /** DivideTask job */
        job?: (IOracleJob|null);

        /** DivideTask big */
        big?: (string|null);
    }

    /** Represents a DivideTask. */
    class DivideTask implements IDivideTask {

        /**
         * Constructs a new DivideTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IDivideTask);

        /** DivideTask scalar. */
        public scalar?: (number|null);

        /** DivideTask aggregatorPubkey. */
        public aggregatorPubkey?: (string|null);

        /** DivideTask job. */
        public job?: (IOracleJob|null);

        /** DivideTask big. */
        public big?: (string|null);

        /** DivideTask Denominator. */
        public Denominator?: ("scalar"|"aggregatorPubkey"|"job"|"big");

        /**
         * Creates a new DivideTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DivideTask instance
         */
        public static create(properties?: OracleJob.IDivideTask): OracleJob.DivideTask;

        /**
         * Encodes the specified DivideTask message. Does not implicitly {@link OracleJob.DivideTask.verify|verify} messages.
         * @param message DivideTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IDivideTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DivideTask message, length delimited. Does not implicitly {@link OracleJob.DivideTask.verify|verify} messages.
         * @param message DivideTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IDivideTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DivideTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DivideTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.DivideTask;

        /**
         * Decodes a DivideTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DivideTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.DivideTask;

        /**
         * Verifies a DivideTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DivideTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DivideTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.DivideTask;

        /**
         * Creates a plain object from a DivideTask message. Also converts values to other types if specified.
         * @param message DivideTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.DivideTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DivideTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MultiplyTask. */
    interface IMultiplyTask {

        /** MultiplyTask scalar */
        scalar?: (number|null);

        /** MultiplyTask aggregatorPubkey */
        aggregatorPubkey?: (string|null);

        /** MultiplyTask job */
        job?: (IOracleJob|null);

        /** MultiplyTask big */
        big?: (string|null);
    }

    /** Represents a MultiplyTask. */
    class MultiplyTask implements IMultiplyTask {

        /**
         * Constructs a new MultiplyTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IMultiplyTask);

        /** MultiplyTask scalar. */
        public scalar?: (number|null);

        /** MultiplyTask aggregatorPubkey. */
        public aggregatorPubkey?: (string|null);

        /** MultiplyTask job. */
        public job?: (IOracleJob|null);

        /** MultiplyTask big. */
        public big?: (string|null);

        /** MultiplyTask Multiple. */
        public Multiple?: ("scalar"|"aggregatorPubkey"|"job"|"big");

        /**
         * Creates a new MultiplyTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MultiplyTask instance
         */
        public static create(properties?: OracleJob.IMultiplyTask): OracleJob.MultiplyTask;

        /**
         * Encodes the specified MultiplyTask message. Does not implicitly {@link OracleJob.MultiplyTask.verify|verify} messages.
         * @param message MultiplyTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IMultiplyTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MultiplyTask message, length delimited. Does not implicitly {@link OracleJob.MultiplyTask.verify|verify} messages.
         * @param message MultiplyTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IMultiplyTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MultiplyTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MultiplyTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.MultiplyTask;

        /**
         * Decodes a MultiplyTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MultiplyTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.MultiplyTask;

        /**
         * Verifies a MultiplyTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MultiplyTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MultiplyTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.MultiplyTask;

        /**
         * Creates a plain object from a MultiplyTask message. Also converts values to other types if specified.
         * @param message MultiplyTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.MultiplyTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MultiplyTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AddTask. */
    interface IAddTask {

        /** AddTask scalar */
        scalar?: (number|null);

        /** AddTask aggregatorPubkey */
        aggregatorPubkey?: (string|null);

        /** AddTask job */
        job?: (IOracleJob|null);

        /** AddTask big */
        big?: (string|null);
    }

    /** Represents an AddTask. */
    class AddTask implements IAddTask {

        /**
         * Constructs a new AddTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IAddTask);

        /** AddTask scalar. */
        public scalar?: (number|null);

        /** AddTask aggregatorPubkey. */
        public aggregatorPubkey?: (string|null);

        /** AddTask job. */
        public job?: (IOracleJob|null);

        /** AddTask big. */
        public big?: (string|null);

        /** AddTask Addition. */
        public Addition?: ("scalar"|"aggregatorPubkey"|"job"|"big");

        /**
         * Creates a new AddTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddTask instance
         */
        public static create(properties?: OracleJob.IAddTask): OracleJob.AddTask;

        /**
         * Encodes the specified AddTask message. Does not implicitly {@link OracleJob.AddTask.verify|verify} messages.
         * @param message AddTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IAddTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddTask message, length delimited. Does not implicitly {@link OracleJob.AddTask.verify|verify} messages.
         * @param message AddTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IAddTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.AddTask;

        /**
         * Decodes an AddTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.AddTask;

        /**
         * Verifies an AddTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.AddTask;

        /**
         * Creates a plain object from an AddTask message. Also converts values to other types if specified.
         * @param message AddTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.AddTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SubtractTask. */
    interface ISubtractTask {

        /** SubtractTask scalar */
        scalar?: (number|null);

        /** SubtractTask aggregatorPubkey */
        aggregatorPubkey?: (string|null);

        /** SubtractTask job */
        job?: (IOracleJob|null);

        /** SubtractTask big */
        big?: (string|null);
    }

    /** Represents a SubtractTask. */
    class SubtractTask implements ISubtractTask {

        /**
         * Constructs a new SubtractTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ISubtractTask);

        /** SubtractTask scalar. */
        public scalar?: (number|null);

        /** SubtractTask aggregatorPubkey. */
        public aggregatorPubkey?: (string|null);

        /** SubtractTask job. */
        public job?: (IOracleJob|null);

        /** SubtractTask big. */
        public big?: (string|null);

        /** SubtractTask Subtraction. */
        public Subtraction?: ("scalar"|"aggregatorPubkey"|"job"|"big");

        /**
         * Creates a new SubtractTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SubtractTask instance
         */
        public static create(properties?: OracleJob.ISubtractTask): OracleJob.SubtractTask;

        /**
         * Encodes the specified SubtractTask message. Does not implicitly {@link OracleJob.SubtractTask.verify|verify} messages.
         * @param message SubtractTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ISubtractTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SubtractTask message, length delimited. Does not implicitly {@link OracleJob.SubtractTask.verify|verify} messages.
         * @param message SubtractTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ISubtractTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SubtractTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SubtractTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.SubtractTask;

        /**
         * Decodes a SubtractTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SubtractTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.SubtractTask;

        /**
         * Verifies a SubtractTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SubtractTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SubtractTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.SubtractTask;

        /**
         * Creates a plain object from a SubtractTask message. Also converts values to other types if specified.
         * @param message SubtractTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.SubtractTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SubtractTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LpTokenPriceTask. */
    interface ILpTokenPriceTask {

        /** LpTokenPriceTask mercurialPoolAddress */
        mercurialPoolAddress?: (string|null);

        /** LpTokenPriceTask saberPoolAddress */
        saberPoolAddress?: (string|null);

        /** LpTokenPriceTask orcaPoolAddress */
        orcaPoolAddress?: (string|null);

        /** LpTokenPriceTask raydiumPoolAddress */
        raydiumPoolAddress?: (string|null);

        /** LpTokenPriceTask priceFeedAddresses */
        priceFeedAddresses?: (string[]|null);

        /** LpTokenPriceTask priceFeedJobs */
        priceFeedJobs?: (IOracleJob[]|null);

        /** LpTokenPriceTask useFairPrice */
        useFairPrice?: (boolean|null);
    }

    /** Represents a LpTokenPriceTask. */
    class LpTokenPriceTask implements ILpTokenPriceTask {

        /**
         * Constructs a new LpTokenPriceTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ILpTokenPriceTask);

        /** LpTokenPriceTask mercurialPoolAddress. */
        public mercurialPoolAddress?: (string|null);

        /** LpTokenPriceTask saberPoolAddress. */
        public saberPoolAddress?: (string|null);

        /** LpTokenPriceTask orcaPoolAddress. */
        public orcaPoolAddress?: (string|null);

        /** LpTokenPriceTask raydiumPoolAddress. */
        public raydiumPoolAddress?: (string|null);

        /** LpTokenPriceTask priceFeedAddresses. */
        public priceFeedAddresses: string[];

        /** LpTokenPriceTask priceFeedJobs. */
        public priceFeedJobs: IOracleJob[];

        /** LpTokenPriceTask useFairPrice. */
        public useFairPrice: boolean;

        /** LpTokenPriceTask PoolAddress. */
        public PoolAddress?: ("mercurialPoolAddress"|"saberPoolAddress"|"orcaPoolAddress"|"raydiumPoolAddress");

        /**
         * Creates a new LpTokenPriceTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LpTokenPriceTask instance
         */
        public static create(properties?: OracleJob.ILpTokenPriceTask): OracleJob.LpTokenPriceTask;

        /**
         * Encodes the specified LpTokenPriceTask message. Does not implicitly {@link OracleJob.LpTokenPriceTask.verify|verify} messages.
         * @param message LpTokenPriceTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ILpTokenPriceTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LpTokenPriceTask message, length delimited. Does not implicitly {@link OracleJob.LpTokenPriceTask.verify|verify} messages.
         * @param message LpTokenPriceTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ILpTokenPriceTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LpTokenPriceTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LpTokenPriceTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.LpTokenPriceTask;

        /**
         * Decodes a LpTokenPriceTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LpTokenPriceTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.LpTokenPriceTask;

        /**
         * Verifies a LpTokenPriceTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LpTokenPriceTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LpTokenPriceTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.LpTokenPriceTask;

        /**
         * Creates a plain object from a LpTokenPriceTask message. Also converts values to other types if specified.
         * @param message LpTokenPriceTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.LpTokenPriceTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LpTokenPriceTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LpExchangeRateTask. */
    interface ILpExchangeRateTask {

        /** LpExchangeRateTask inTokenAddress */
        inTokenAddress?: (string|null);

        /** LpExchangeRateTask outTokenAddress */
        outTokenAddress?: (string|null);

        /** LpExchangeRateTask mercurialPoolAddress */
        mercurialPoolAddress?: (string|null);

        /** LpExchangeRateTask saberPoolAddress */
        saberPoolAddress?: (string|null);

        /** LpExchangeRateTask orcaPoolTokenMintAddress */
        orcaPoolTokenMintAddress?: (string|null);

        /** LpExchangeRateTask raydiumPoolAddress */
        raydiumPoolAddress?: (string|null);

        /** LpExchangeRateTask orcaPoolAddress */
        orcaPoolAddress?: (string|null);

        /** LpExchangeRateTask portReserveAddress */
        portReserveAddress?: (string|null);
    }

    /** Represents a LpExchangeRateTask. */
    class LpExchangeRateTask implements ILpExchangeRateTask {

        /**
         * Constructs a new LpExchangeRateTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ILpExchangeRateTask);

        /** LpExchangeRateTask inTokenAddress. */
        public inTokenAddress: string;

        /** LpExchangeRateTask outTokenAddress. */
        public outTokenAddress: string;

        /** LpExchangeRateTask mercurialPoolAddress. */
        public mercurialPoolAddress?: (string|null);

        /** LpExchangeRateTask saberPoolAddress. */
        public saberPoolAddress?: (string|null);

        /** LpExchangeRateTask orcaPoolTokenMintAddress. */
        public orcaPoolTokenMintAddress?: (string|null);

        /** LpExchangeRateTask raydiumPoolAddress. */
        public raydiumPoolAddress?: (string|null);

        /** LpExchangeRateTask orcaPoolAddress. */
        public orcaPoolAddress?: (string|null);

        /** LpExchangeRateTask portReserveAddress. */
        public portReserveAddress?: (string|null);

        /** LpExchangeRateTask PoolAddress. */
        public PoolAddress?: ("mercurialPoolAddress"|"saberPoolAddress"|"orcaPoolTokenMintAddress"|"raydiumPoolAddress"|"orcaPoolAddress"|"portReserveAddress");

        /**
         * Creates a new LpExchangeRateTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LpExchangeRateTask instance
         */
        public static create(properties?: OracleJob.ILpExchangeRateTask): OracleJob.LpExchangeRateTask;

        /**
         * Encodes the specified LpExchangeRateTask message. Does not implicitly {@link OracleJob.LpExchangeRateTask.verify|verify} messages.
         * @param message LpExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ILpExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LpExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.LpExchangeRateTask.verify|verify} messages.
         * @param message LpExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ILpExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LpExchangeRateTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LpExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.LpExchangeRateTask;

        /**
         * Decodes a LpExchangeRateTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LpExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.LpExchangeRateTask;

        /**
         * Verifies a LpExchangeRateTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LpExchangeRateTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LpExchangeRateTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.LpExchangeRateTask;

        /**
         * Creates a plain object from a LpExchangeRateTask message. Also converts values to other types if specified.
         * @param message LpExchangeRateTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.LpExchangeRateTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LpExchangeRateTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RegexExtractTask. */
    interface IRegexExtractTask {

        /** RegexExtractTask pattern */
        pattern?: (string|null);

        /** RegexExtractTask groupNumber */
        groupNumber?: (number|null);
    }

    /** Represents a RegexExtractTask. */
    class RegexExtractTask implements IRegexExtractTask {

        /**
         * Constructs a new RegexExtractTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IRegexExtractTask);

        /** RegexExtractTask pattern. */
        public pattern: string;

        /** RegexExtractTask groupNumber. */
        public groupNumber: number;

        /**
         * Creates a new RegexExtractTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RegexExtractTask instance
         */
        public static create(properties?: OracleJob.IRegexExtractTask): OracleJob.RegexExtractTask;

        /**
         * Encodes the specified RegexExtractTask message. Does not implicitly {@link OracleJob.RegexExtractTask.verify|verify} messages.
         * @param message RegexExtractTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IRegexExtractTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RegexExtractTask message, length delimited. Does not implicitly {@link OracleJob.RegexExtractTask.verify|verify} messages.
         * @param message RegexExtractTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IRegexExtractTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RegexExtractTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RegexExtractTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.RegexExtractTask;

        /**
         * Decodes a RegexExtractTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RegexExtractTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.RegexExtractTask;

        /**
         * Verifies a RegexExtractTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RegexExtractTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RegexExtractTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.RegexExtractTask;

        /**
         * Creates a plain object from a RegexExtractTask message. Also converts values to other types if specified.
         * @param message RegexExtractTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.RegexExtractTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RegexExtractTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a XStepPriceTask. */
    interface IXStepPriceTask {

        /** XStepPriceTask stepJob */
        stepJob?: (OracleJob.IMedianTask|null);

        /** XStepPriceTask stepAggregatorPubkey */
        stepAggregatorPubkey?: (string|null);
    }

    /** Represents a XStepPriceTask. */
    class XStepPriceTask implements IXStepPriceTask {

        /**
         * Constructs a new XStepPriceTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IXStepPriceTask);

        /** XStepPriceTask stepJob. */
        public stepJob?: (OracleJob.IMedianTask|null);

        /** XStepPriceTask stepAggregatorPubkey. */
        public stepAggregatorPubkey?: (string|null);

        /** XStepPriceTask StepSource. */
        public StepSource?: ("stepJob"|"stepAggregatorPubkey");

        /**
         * Creates a new XStepPriceTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns XStepPriceTask instance
         */
        public static create(properties?: OracleJob.IXStepPriceTask): OracleJob.XStepPriceTask;

        /**
         * Encodes the specified XStepPriceTask message. Does not implicitly {@link OracleJob.XStepPriceTask.verify|verify} messages.
         * @param message XStepPriceTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IXStepPriceTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified XStepPriceTask message, length delimited. Does not implicitly {@link OracleJob.XStepPriceTask.verify|verify} messages.
         * @param message XStepPriceTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IXStepPriceTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a XStepPriceTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns XStepPriceTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.XStepPriceTask;

        /**
         * Decodes a XStepPriceTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns XStepPriceTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.XStepPriceTask;

        /**
         * Verifies a XStepPriceTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a XStepPriceTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns XStepPriceTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.XStepPriceTask;

        /**
         * Creates a plain object from a XStepPriceTask message. Also converts values to other types if specified.
         * @param message XStepPriceTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.XStepPriceTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this XStepPriceTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TwapTask. */
    interface ITwapTask {

        /** TwapTask aggregatorPubkey */
        aggregatorPubkey?: (string|null);

        /** TwapTask period */
        period?: (number|null);

        /** TwapTask weightByPropagationTime */
        weightByPropagationTime?: (boolean|null);

        /** TwapTask minSamples */
        minSamples?: (number|null);

        /** TwapTask endingUnixTimestamp */
        endingUnixTimestamp?: (number|null);

        /** TwapTask endingUnixTimestampTask */
        endingUnixTimestampTask?: (OracleJob.ICronParseTask|null);
    }

    /** Represents a TwapTask. */
    class TwapTask implements ITwapTask {

        /**
         * Constructs a new TwapTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ITwapTask);

        /** TwapTask aggregatorPubkey. */
        public aggregatorPubkey: string;

        /** TwapTask period. */
        public period: number;

        /** TwapTask weightByPropagationTime. */
        public weightByPropagationTime: boolean;

        /** TwapTask minSamples. */
        public minSamples: number;

        /** TwapTask endingUnixTimestamp. */
        public endingUnixTimestamp: number;

        /** TwapTask endingUnixTimestampTask. */
        public endingUnixTimestampTask?: (OracleJob.ICronParseTask|null);

        /**
         * Creates a new TwapTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TwapTask instance
         */
        public static create(properties?: OracleJob.ITwapTask): OracleJob.TwapTask;

        /**
         * Encodes the specified TwapTask message. Does not implicitly {@link OracleJob.TwapTask.verify|verify} messages.
         * @param message TwapTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ITwapTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TwapTask message, length delimited. Does not implicitly {@link OracleJob.TwapTask.verify|verify} messages.
         * @param message TwapTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ITwapTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TwapTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TwapTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.TwapTask;

        /**
         * Decodes a TwapTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TwapTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.TwapTask;

        /**
         * Verifies a TwapTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TwapTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TwapTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.TwapTask;

        /**
         * Creates a plain object from a TwapTask message. Also converts values to other types if specified.
         * @param message TwapTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.TwapTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TwapTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SerumSwapTask. */
    interface ISerumSwapTask {

        /** SerumSwapTask serumPoolAddress */
        serumPoolAddress?: (string|null);
    }

    /** Represents a SerumSwapTask. */
    class SerumSwapTask implements ISerumSwapTask {

        /**
         * Constructs a new SerumSwapTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ISerumSwapTask);

        /** SerumSwapTask serumPoolAddress. */
        public serumPoolAddress: string;

        /**
         * Creates a new SerumSwapTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SerumSwapTask instance
         */
        public static create(properties?: OracleJob.ISerumSwapTask): OracleJob.SerumSwapTask;

        /**
         * Encodes the specified SerumSwapTask message. Does not implicitly {@link OracleJob.SerumSwapTask.verify|verify} messages.
         * @param message SerumSwapTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ISerumSwapTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SerumSwapTask message, length delimited. Does not implicitly {@link OracleJob.SerumSwapTask.verify|verify} messages.
         * @param message SerumSwapTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ISerumSwapTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SerumSwapTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SerumSwapTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.SerumSwapTask;

        /**
         * Decodes a SerumSwapTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SerumSwapTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.SerumSwapTask;

        /**
         * Verifies a SerumSwapTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SerumSwapTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SerumSwapTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.SerumSwapTask;

        /**
         * Creates a plain object from a SerumSwapTask message. Also converts values to other types if specified.
         * @param message SerumSwapTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.SerumSwapTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SerumSwapTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PowTask. */
    interface IPowTask {

        /** PowTask scalar */
        scalar?: (number|null);

        /** PowTask aggregatorPubkey */
        aggregatorPubkey?: (string|null);

        /** PowTask big */
        big?: (string|null);
    }

    /** Represents a PowTask. */
    class PowTask implements IPowTask {

        /**
         * Constructs a new PowTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IPowTask);

        /** PowTask scalar. */
        public scalar?: (number|null);

        /** PowTask aggregatorPubkey. */
        public aggregatorPubkey?: (string|null);

        /** PowTask big. */
        public big?: (string|null);

        /** PowTask Exponent. */
        public Exponent?: ("scalar"|"aggregatorPubkey"|"big");

        /**
         * Creates a new PowTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PowTask instance
         */
        public static create(properties?: OracleJob.IPowTask): OracleJob.PowTask;

        /**
         * Encodes the specified PowTask message. Does not implicitly {@link OracleJob.PowTask.verify|verify} messages.
         * @param message PowTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IPowTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PowTask message, length delimited. Does not implicitly {@link OracleJob.PowTask.verify|verify} messages.
         * @param message PowTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IPowTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PowTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PowTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.PowTask;

        /**
         * Decodes a PowTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PowTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.PowTask;

        /**
         * Verifies a PowTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PowTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PowTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.PowTask;

        /**
         * Creates a plain object from a PowTask message. Also converts values to other types if specified.
         * @param message PowTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.PowTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PowTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LendingRateTask. */
    interface ILendingRateTask {

        /** LendingRateTask protocol */
        protocol?: (string|null);

        /** LendingRateTask assetMint */
        assetMint?: (string|null);

        /** LendingRateTask field */
        field?: (OracleJob.LendingRateTask.Field|null);
    }

    /** Represents a LendingRateTask. */
    class LendingRateTask implements ILendingRateTask {

        /**
         * Constructs a new LendingRateTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ILendingRateTask);

        /** LendingRateTask protocol. */
        public protocol: string;

        /** LendingRateTask assetMint. */
        public assetMint: string;

        /** LendingRateTask field. */
        public field: OracleJob.LendingRateTask.Field;

        /**
         * Creates a new LendingRateTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LendingRateTask instance
         */
        public static create(properties?: OracleJob.ILendingRateTask): OracleJob.LendingRateTask;

        /**
         * Encodes the specified LendingRateTask message. Does not implicitly {@link OracleJob.LendingRateTask.verify|verify} messages.
         * @param message LendingRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ILendingRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LendingRateTask message, length delimited. Does not implicitly {@link OracleJob.LendingRateTask.verify|verify} messages.
         * @param message LendingRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ILendingRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LendingRateTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LendingRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.LendingRateTask;

        /**
         * Decodes a LendingRateTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LendingRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.LendingRateTask;

        /**
         * Verifies a LendingRateTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LendingRateTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LendingRateTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.LendingRateTask;

        /**
         * Creates a plain object from a LendingRateTask message. Also converts values to other types if specified.
         * @param message LendingRateTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.LendingRateTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LendingRateTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace LendingRateTask {

        /** Field enum. */
        enum Field {
            FIELD_DEPOSIT_RATE = 0,
            FIELD_BORROW_RATE = 1
        }
    }

    /** Properties of a MangoPerpMarketTask. */
    interface IMangoPerpMarketTask {

        /** MangoPerpMarketTask perpMarketAddress */
        perpMarketAddress?: (string|null);
    }

    /** Represents a MangoPerpMarketTask. */
    class MangoPerpMarketTask implements IMangoPerpMarketTask {

        /**
         * Constructs a new MangoPerpMarketTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IMangoPerpMarketTask);

        /** MangoPerpMarketTask perpMarketAddress. */
        public perpMarketAddress: string;

        /**
         * Creates a new MangoPerpMarketTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MangoPerpMarketTask instance
         */
        public static create(properties?: OracleJob.IMangoPerpMarketTask): OracleJob.MangoPerpMarketTask;

        /**
         * Encodes the specified MangoPerpMarketTask message. Does not implicitly {@link OracleJob.MangoPerpMarketTask.verify|verify} messages.
         * @param message MangoPerpMarketTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IMangoPerpMarketTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MangoPerpMarketTask message, length delimited. Does not implicitly {@link OracleJob.MangoPerpMarketTask.verify|verify} messages.
         * @param message MangoPerpMarketTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IMangoPerpMarketTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MangoPerpMarketTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MangoPerpMarketTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.MangoPerpMarketTask;

        /**
         * Decodes a MangoPerpMarketTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MangoPerpMarketTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.MangoPerpMarketTask;

        /**
         * Verifies a MangoPerpMarketTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MangoPerpMarketTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MangoPerpMarketTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.MangoPerpMarketTask;

        /**
         * Creates a plain object from a MangoPerpMarketTask message. Also converts values to other types if specified.
         * @param message MangoPerpMarketTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.MangoPerpMarketTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MangoPerpMarketTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a JupiterSwapTask. */
    interface IJupiterSwapTask {

        /** JupiterSwapTask inTokenAddress */
        inTokenAddress?: (string|null);

        /** JupiterSwapTask outTokenAddress */
        outTokenAddress?: (string|null);

        /** JupiterSwapTask baseAmount */
        baseAmount?: (number|null);
    }

    /** Represents a JupiterSwapTask. */
    class JupiterSwapTask implements IJupiterSwapTask {

        /**
         * Constructs a new JupiterSwapTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IJupiterSwapTask);

        /** JupiterSwapTask inTokenAddress. */
        public inTokenAddress: string;

        /** JupiterSwapTask outTokenAddress. */
        public outTokenAddress: string;

        /** JupiterSwapTask baseAmount. */
        public baseAmount: number;

        /**
         * Creates a new JupiterSwapTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JupiterSwapTask instance
         */
        public static create(properties?: OracleJob.IJupiterSwapTask): OracleJob.JupiterSwapTask;

        /**
         * Encodes the specified JupiterSwapTask message. Does not implicitly {@link OracleJob.JupiterSwapTask.verify|verify} messages.
         * @param message JupiterSwapTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IJupiterSwapTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified JupiterSwapTask message, length delimited. Does not implicitly {@link OracleJob.JupiterSwapTask.verify|verify} messages.
         * @param message JupiterSwapTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IJupiterSwapTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JupiterSwapTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JupiterSwapTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.JupiterSwapTask;

        /**
         * Decodes a JupiterSwapTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JupiterSwapTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.JupiterSwapTask;

        /**
         * Verifies a JupiterSwapTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a JupiterSwapTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns JupiterSwapTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.JupiterSwapTask;

        /**
         * Creates a plain object from a JupiterSwapTask message. Also converts values to other types if specified.
         * @param message JupiterSwapTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.JupiterSwapTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this JupiterSwapTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PerpMarketTask. */
    interface IPerpMarketTask {

        /** PerpMarketTask mangoMarketAddress */
        mangoMarketAddress?: (string|null);

        /** PerpMarketTask driftMarketAddress */
        driftMarketAddress?: (string|null);

        /** PerpMarketTask zetaMarketAddress */
        zetaMarketAddress?: (string|null);

        /** PerpMarketTask zoMarketAddress */
        zoMarketAddress?: (string|null);
    }

    /** Represents a PerpMarketTask. */
    class PerpMarketTask implements IPerpMarketTask {

        /**
         * Constructs a new PerpMarketTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IPerpMarketTask);

        /** PerpMarketTask mangoMarketAddress. */
        public mangoMarketAddress?: (string|null);

        /** PerpMarketTask driftMarketAddress. */
        public driftMarketAddress?: (string|null);

        /** PerpMarketTask zetaMarketAddress. */
        public zetaMarketAddress?: (string|null);

        /** PerpMarketTask zoMarketAddress. */
        public zoMarketAddress?: (string|null);

        /** PerpMarketTask MarketAddress. */
        public MarketAddress?: ("mangoMarketAddress"|"driftMarketAddress"|"zetaMarketAddress"|"zoMarketAddress");

        /**
         * Creates a new PerpMarketTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PerpMarketTask instance
         */
        public static create(properties?: OracleJob.IPerpMarketTask): OracleJob.PerpMarketTask;

        /**
         * Encodes the specified PerpMarketTask message. Does not implicitly {@link OracleJob.PerpMarketTask.verify|verify} messages.
         * @param message PerpMarketTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IPerpMarketTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PerpMarketTask message, length delimited. Does not implicitly {@link OracleJob.PerpMarketTask.verify|verify} messages.
         * @param message PerpMarketTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IPerpMarketTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PerpMarketTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PerpMarketTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.PerpMarketTask;

        /**
         * Decodes a PerpMarketTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PerpMarketTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.PerpMarketTask;

        /**
         * Verifies a PerpMarketTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PerpMarketTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PerpMarketTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.PerpMarketTask;

        /**
         * Creates a plain object from a PerpMarketTask message. Also converts values to other types if specified.
         * @param message PerpMarketTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.PerpMarketTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PerpMarketTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an OracleTask. */
    interface IOracleTask {

        /** OracleTask switchboardAddress */
        switchboardAddress?: (string|null);

        /** OracleTask pythAddress */
        pythAddress?: (string|null);

        /** OracleTask chainlinkAddress */
        chainlinkAddress?: (string|null);

        /** OracleTask pythAllowedConfidenceInterval */
        pythAllowedConfidenceInterval?: (number|null);
    }

    /** Represents an OracleTask. */
    class OracleTask implements IOracleTask {

        /**
         * Constructs a new OracleTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IOracleTask);

        /** OracleTask switchboardAddress. */
        public switchboardAddress?: (string|null);

        /** OracleTask pythAddress. */
        public pythAddress?: (string|null);

        /** OracleTask chainlinkAddress. */
        public chainlinkAddress?: (string|null);

        /** OracleTask pythAllowedConfidenceInterval. */
        public pythAllowedConfidenceInterval: number;

        /** OracleTask AggregatorAddress. */
        public AggregatorAddress?: ("switchboardAddress"|"pythAddress"|"chainlinkAddress");

        /**
         * Creates a new OracleTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OracleTask instance
         */
        public static create(properties?: OracleJob.IOracleTask): OracleJob.OracleTask;

        /**
         * Encodes the specified OracleTask message. Does not implicitly {@link OracleJob.OracleTask.verify|verify} messages.
         * @param message OracleTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IOracleTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OracleTask message, length delimited. Does not implicitly {@link OracleJob.OracleTask.verify|verify} messages.
         * @param message OracleTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IOracleTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OracleTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OracleTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.OracleTask;

        /**
         * Decodes an OracleTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OracleTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.OracleTask;

        /**
         * Verifies an OracleTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OracleTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OracleTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.OracleTask;

        /**
         * Creates a plain object from an OracleTask message. Also converts values to other types if specified.
         * @param message OracleTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.OracleTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OracleTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AnchorFetchTask. */
    interface IAnchorFetchTask {

        /** AnchorFetchTask programId */
        programId?: (string|null);

        /** AnchorFetchTask accountAddress */
        accountAddress?: (string|null);
    }

    /** Represents an AnchorFetchTask. */
    class AnchorFetchTask implements IAnchorFetchTask {

        /**
         * Constructs a new AnchorFetchTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IAnchorFetchTask);

        /** AnchorFetchTask programId. */
        public programId: string;

        /** AnchorFetchTask accountAddress. */
        public accountAddress: string;

        /**
         * Creates a new AnchorFetchTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AnchorFetchTask instance
         */
        public static create(properties?: OracleJob.IAnchorFetchTask): OracleJob.AnchorFetchTask;

        /**
         * Encodes the specified AnchorFetchTask message. Does not implicitly {@link OracleJob.AnchorFetchTask.verify|verify} messages.
         * @param message AnchorFetchTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IAnchorFetchTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AnchorFetchTask message, length delimited. Does not implicitly {@link OracleJob.AnchorFetchTask.verify|verify} messages.
         * @param message AnchorFetchTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IAnchorFetchTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AnchorFetchTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AnchorFetchTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.AnchorFetchTask;

        /**
         * Decodes an AnchorFetchTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AnchorFetchTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.AnchorFetchTask;

        /**
         * Verifies an AnchorFetchTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AnchorFetchTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AnchorFetchTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.AnchorFetchTask;

        /**
         * Creates a plain object from an AnchorFetchTask message. Also converts values to other types if specified.
         * @param message AnchorFetchTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.AnchorFetchTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AnchorFetchTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TpsTask. */
    interface ITpsTask {
    }

    /** Represents a TpsTask. */
    class TpsTask implements ITpsTask {

        /**
         * Constructs a new TpsTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ITpsTask);

        /**
         * Creates a new TpsTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TpsTask instance
         */
        public static create(properties?: OracleJob.ITpsTask): OracleJob.TpsTask;

        /**
         * Encodes the specified TpsTask message. Does not implicitly {@link OracleJob.TpsTask.verify|verify} messages.
         * @param message TpsTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ITpsTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TpsTask message, length delimited. Does not implicitly {@link OracleJob.TpsTask.verify|verify} messages.
         * @param message TpsTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ITpsTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TpsTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TpsTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.TpsTask;

        /**
         * Decodes a TpsTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TpsTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.TpsTask;

        /**
         * Verifies a TpsTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TpsTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TpsTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.TpsTask;

        /**
         * Creates a plain object from a TpsTask message. Also converts values to other types if specified.
         * @param message TpsTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.TpsTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TpsTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SplStakePoolTask. */
    interface ISplStakePoolTask {

        /** SplStakePoolTask pubkey */
        pubkey?: (string|null);
    }

    /** Represents a SplStakePoolTask. */
    class SplStakePoolTask implements ISplStakePoolTask {

        /**
         * Constructs a new SplStakePoolTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ISplStakePoolTask);

        /** SplStakePoolTask pubkey. */
        public pubkey: string;

        /**
         * Creates a new SplStakePoolTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SplStakePoolTask instance
         */
        public static create(properties?: OracleJob.ISplStakePoolTask): OracleJob.SplStakePoolTask;

        /**
         * Encodes the specified SplStakePoolTask message. Does not implicitly {@link OracleJob.SplStakePoolTask.verify|verify} messages.
         * @param message SplStakePoolTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ISplStakePoolTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SplStakePoolTask message, length delimited. Does not implicitly {@link OracleJob.SplStakePoolTask.verify|verify} messages.
         * @param message SplStakePoolTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ISplStakePoolTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SplStakePoolTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SplStakePoolTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.SplStakePoolTask;

        /**
         * Decodes a SplStakePoolTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SplStakePoolTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.SplStakePoolTask;

        /**
         * Verifies a SplStakePoolTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SplStakePoolTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SplStakePoolTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.SplStakePoolTask;

        /**
         * Creates a plain object from a SplStakePoolTask message. Also converts values to other types if specified.
         * @param message SplStakePoolTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.SplStakePoolTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SplStakePoolTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SplTokenParseTask. */
    interface ISplTokenParseTask {

        /** SplTokenParseTask tokenAccountAddress */
        tokenAccountAddress?: (string|null);

        /** SplTokenParseTask mintAddress */
        mintAddress?: (string|null);
    }

    /** Represents a SplTokenParseTask. */
    class SplTokenParseTask implements ISplTokenParseTask {

        /**
         * Constructs a new SplTokenParseTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ISplTokenParseTask);

        /** SplTokenParseTask tokenAccountAddress. */
        public tokenAccountAddress?: (string|null);

        /** SplTokenParseTask mintAddress. */
        public mintAddress?: (string|null);

        /** SplTokenParseTask AccountAddress. */
        public AccountAddress?: ("tokenAccountAddress"|"mintAddress");

        /**
         * Creates a new SplTokenParseTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SplTokenParseTask instance
         */
        public static create(properties?: OracleJob.ISplTokenParseTask): OracleJob.SplTokenParseTask;

        /**
         * Encodes the specified SplTokenParseTask message. Does not implicitly {@link OracleJob.SplTokenParseTask.verify|verify} messages.
         * @param message SplTokenParseTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ISplTokenParseTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SplTokenParseTask message, length delimited. Does not implicitly {@link OracleJob.SplTokenParseTask.verify|verify} messages.
         * @param message SplTokenParseTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ISplTokenParseTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SplTokenParseTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SplTokenParseTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.SplTokenParseTask;

        /**
         * Decodes a SplTokenParseTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SplTokenParseTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.SplTokenParseTask;

        /**
         * Verifies a SplTokenParseTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SplTokenParseTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SplTokenParseTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.SplTokenParseTask;

        /**
         * Creates a plain object from a SplTokenParseTask message. Also converts values to other types if specified.
         * @param message SplTokenParseTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.SplTokenParseTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SplTokenParseTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DefiKingdomsTask. */
    interface IDefiKingdomsTask {

        /** DefiKingdomsTask provider */
        provider?: (string|null);

        /** DefiKingdomsTask inToken */
        inToken?: (OracleJob.DefiKingdomsTask.IToken|null);

        /** DefiKingdomsTask outToken */
        outToken?: (OracleJob.DefiKingdomsTask.IToken|null);
    }

    /** Represents a DefiKingdomsTask. */
    class DefiKingdomsTask implements IDefiKingdomsTask {

        /**
         * Constructs a new DefiKingdomsTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IDefiKingdomsTask);

        /** DefiKingdomsTask provider. */
        public provider: string;

        /** DefiKingdomsTask inToken. */
        public inToken?: (OracleJob.DefiKingdomsTask.IToken|null);

        /** DefiKingdomsTask outToken. */
        public outToken?: (OracleJob.DefiKingdomsTask.IToken|null);

        /**
         * Creates a new DefiKingdomsTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DefiKingdomsTask instance
         */
        public static create(properties?: OracleJob.IDefiKingdomsTask): OracleJob.DefiKingdomsTask;

        /**
         * Encodes the specified DefiKingdomsTask message. Does not implicitly {@link OracleJob.DefiKingdomsTask.verify|verify} messages.
         * @param message DefiKingdomsTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IDefiKingdomsTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DefiKingdomsTask message, length delimited. Does not implicitly {@link OracleJob.DefiKingdomsTask.verify|verify} messages.
         * @param message DefiKingdomsTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IDefiKingdomsTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DefiKingdomsTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DefiKingdomsTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.DefiKingdomsTask;

        /**
         * Decodes a DefiKingdomsTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DefiKingdomsTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.DefiKingdomsTask;

        /**
         * Verifies a DefiKingdomsTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DefiKingdomsTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DefiKingdomsTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.DefiKingdomsTask;

        /**
         * Creates a plain object from a DefiKingdomsTask message. Also converts values to other types if specified.
         * @param message DefiKingdomsTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.DefiKingdomsTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DefiKingdomsTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace DefiKingdomsTask {

        /** Properties of a Token. */
        interface IToken {

            /** Token address */
            address?: (string|null);

            /** Token decimals */
            decimals?: (number|null);
        }

        /** Represents a Token. */
        class Token implements IToken {

            /**
             * Constructs a new Token.
             * @param [properties] Properties to set
             */
            constructor(properties?: OracleJob.DefiKingdomsTask.IToken);

            /** Token address. */
            public address: string;

            /** Token decimals. */
            public decimals: number;

            /**
             * Creates a new Token instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Token instance
             */
            public static create(properties?: OracleJob.DefiKingdomsTask.IToken): OracleJob.DefiKingdomsTask.Token;

            /**
             * Encodes the specified Token message. Does not implicitly {@link OracleJob.DefiKingdomsTask.Token.verify|verify} messages.
             * @param message Token message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: OracleJob.DefiKingdomsTask.IToken, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Token message, length delimited. Does not implicitly {@link OracleJob.DefiKingdomsTask.Token.verify|verify} messages.
             * @param message Token message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: OracleJob.DefiKingdomsTask.IToken, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Token message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Token
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.DefiKingdomsTask.Token;

            /**
             * Decodes a Token message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Token
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.DefiKingdomsTask.Token;

            /**
             * Verifies a Token message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Token message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Token
             */
            public static fromObject(object: { [k: string]: any }): OracleJob.DefiKingdomsTask.Token;

            /**
             * Creates a plain object from a Token message. Also converts values to other types if specified.
             * @param message Token
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: OracleJob.DefiKingdomsTask.Token, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Token to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of an UniswapExchangeRateTask. */
    interface IUniswapExchangeRateTask {

        /** UniswapExchangeRateTask inTokenAddress */
        inTokenAddress?: (string|null);

        /** UniswapExchangeRateTask outTokenAddress */
        outTokenAddress?: (string|null);

        /** UniswapExchangeRateTask inTokenAmount */
        inTokenAmount?: (number|null);

        /** UniswapExchangeRateTask slippage */
        slippage?: (number|null);

        /** UniswapExchangeRateTask provider */
        provider?: (string|null);
    }

    /** Represents an UniswapExchangeRateTask. */
    class UniswapExchangeRateTask implements IUniswapExchangeRateTask {

        /**
         * Constructs a new UniswapExchangeRateTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IUniswapExchangeRateTask);

        /** UniswapExchangeRateTask inTokenAddress. */
        public inTokenAddress: string;

        /** UniswapExchangeRateTask outTokenAddress. */
        public outTokenAddress: string;

        /** UniswapExchangeRateTask inTokenAmount. */
        public inTokenAmount: number;

        /** UniswapExchangeRateTask slippage. */
        public slippage: number;

        /** UniswapExchangeRateTask provider. */
        public provider: string;

        /**
         * Creates a new UniswapExchangeRateTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UniswapExchangeRateTask instance
         */
        public static create(properties?: OracleJob.IUniswapExchangeRateTask): OracleJob.UniswapExchangeRateTask;

        /**
         * Encodes the specified UniswapExchangeRateTask message. Does not implicitly {@link OracleJob.UniswapExchangeRateTask.verify|verify} messages.
         * @param message UniswapExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IUniswapExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UniswapExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.UniswapExchangeRateTask.verify|verify} messages.
         * @param message UniswapExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IUniswapExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UniswapExchangeRateTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UniswapExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.UniswapExchangeRateTask;

        /**
         * Decodes an UniswapExchangeRateTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UniswapExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.UniswapExchangeRateTask;

        /**
         * Verifies an UniswapExchangeRateTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UniswapExchangeRateTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UniswapExchangeRateTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.UniswapExchangeRateTask;

        /**
         * Creates a plain object from an UniswapExchangeRateTask message. Also converts values to other types if specified.
         * @param message UniswapExchangeRateTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.UniswapExchangeRateTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UniswapExchangeRateTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SushiswapExchangeRateTask. */
    interface ISushiswapExchangeRateTask {

        /** SushiswapExchangeRateTask inTokenAddress */
        inTokenAddress?: (string|null);

        /** SushiswapExchangeRateTask outTokenAddress */
        outTokenAddress?: (string|null);

        /** SushiswapExchangeRateTask inTokenAmount */
        inTokenAmount?: (number|null);

        /** SushiswapExchangeRateTask slippage */
        slippage?: (number|null);

        /** SushiswapExchangeRateTask provider */
        provider?: (string|null);
    }

    /** Represents a SushiswapExchangeRateTask. */
    class SushiswapExchangeRateTask implements ISushiswapExchangeRateTask {

        /**
         * Constructs a new SushiswapExchangeRateTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ISushiswapExchangeRateTask);

        /** SushiswapExchangeRateTask inTokenAddress. */
        public inTokenAddress: string;

        /** SushiswapExchangeRateTask outTokenAddress. */
        public outTokenAddress: string;

        /** SushiswapExchangeRateTask inTokenAmount. */
        public inTokenAmount: number;

        /** SushiswapExchangeRateTask slippage. */
        public slippage: number;

        /** SushiswapExchangeRateTask provider. */
        public provider: string;

        /**
         * Creates a new SushiswapExchangeRateTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SushiswapExchangeRateTask instance
         */
        public static create(properties?: OracleJob.ISushiswapExchangeRateTask): OracleJob.SushiswapExchangeRateTask;

        /**
         * Encodes the specified SushiswapExchangeRateTask message. Does not implicitly {@link OracleJob.SushiswapExchangeRateTask.verify|verify} messages.
         * @param message SushiswapExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ISushiswapExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SushiswapExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.SushiswapExchangeRateTask.verify|verify} messages.
         * @param message SushiswapExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ISushiswapExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SushiswapExchangeRateTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SushiswapExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.SushiswapExchangeRateTask;

        /**
         * Decodes a SushiswapExchangeRateTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SushiswapExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.SushiswapExchangeRateTask;

        /**
         * Verifies a SushiswapExchangeRateTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SushiswapExchangeRateTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SushiswapExchangeRateTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.SushiswapExchangeRateTask;

        /**
         * Creates a plain object from a SushiswapExchangeRateTask message. Also converts values to other types if specified.
         * @param message SushiswapExchangeRateTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.SushiswapExchangeRateTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SushiswapExchangeRateTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PancakeswapExchangeRateTask. */
    interface IPancakeswapExchangeRateTask {

        /** PancakeswapExchangeRateTask inTokenAddress */
        inTokenAddress?: (string|null);

        /** PancakeswapExchangeRateTask outTokenAddress */
        outTokenAddress?: (string|null);

        /** PancakeswapExchangeRateTask inTokenAmount */
        inTokenAmount?: (number|null);

        /** PancakeswapExchangeRateTask slippage */
        slippage?: (number|null);

        /** PancakeswapExchangeRateTask provider */
        provider?: (string|null);
    }

    /** Represents a PancakeswapExchangeRateTask. */
    class PancakeswapExchangeRateTask implements IPancakeswapExchangeRateTask {

        /**
         * Constructs a new PancakeswapExchangeRateTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IPancakeswapExchangeRateTask);

        /** PancakeswapExchangeRateTask inTokenAddress. */
        public inTokenAddress: string;

        /** PancakeswapExchangeRateTask outTokenAddress. */
        public outTokenAddress: string;

        /** PancakeswapExchangeRateTask inTokenAmount. */
        public inTokenAmount: number;

        /** PancakeswapExchangeRateTask slippage. */
        public slippage: number;

        /** PancakeswapExchangeRateTask provider. */
        public provider: string;

        /**
         * Creates a new PancakeswapExchangeRateTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PancakeswapExchangeRateTask instance
         */
        public static create(properties?: OracleJob.IPancakeswapExchangeRateTask): OracleJob.PancakeswapExchangeRateTask;

        /**
         * Encodes the specified PancakeswapExchangeRateTask message. Does not implicitly {@link OracleJob.PancakeswapExchangeRateTask.verify|verify} messages.
         * @param message PancakeswapExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IPancakeswapExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PancakeswapExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.PancakeswapExchangeRateTask.verify|verify} messages.
         * @param message PancakeswapExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IPancakeswapExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PancakeswapExchangeRateTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PancakeswapExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.PancakeswapExchangeRateTask;

        /**
         * Decodes a PancakeswapExchangeRateTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PancakeswapExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.PancakeswapExchangeRateTask;

        /**
         * Verifies a PancakeswapExchangeRateTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PancakeswapExchangeRateTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PancakeswapExchangeRateTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.PancakeswapExchangeRateTask;

        /**
         * Creates a plain object from a PancakeswapExchangeRateTask message. Also converts values to other types if specified.
         * @param message PancakeswapExchangeRateTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.PancakeswapExchangeRateTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PancakeswapExchangeRateTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CacheTask. */
    interface ICacheTask {

        /** CacheTask cacheItems */
        cacheItems?: (OracleJob.CacheTask.ICacheItem[]|null);
    }

    /** Represents a CacheTask. */
    class CacheTask implements ICacheTask {

        /**
         * Constructs a new CacheTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ICacheTask);

        /** CacheTask cacheItems. */
        public cacheItems: OracleJob.CacheTask.ICacheItem[];

        /**
         * Creates a new CacheTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CacheTask instance
         */
        public static create(properties?: OracleJob.ICacheTask): OracleJob.CacheTask;

        /**
         * Encodes the specified CacheTask message. Does not implicitly {@link OracleJob.CacheTask.verify|verify} messages.
         * @param message CacheTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ICacheTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CacheTask message, length delimited. Does not implicitly {@link OracleJob.CacheTask.verify|verify} messages.
         * @param message CacheTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ICacheTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CacheTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CacheTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.CacheTask;

        /**
         * Decodes a CacheTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CacheTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.CacheTask;

        /**
         * Verifies a CacheTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CacheTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CacheTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.CacheTask;

        /**
         * Creates a plain object from a CacheTask message. Also converts values to other types if specified.
         * @param message CacheTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.CacheTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CacheTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace CacheTask {

        /** Properties of a CacheItem. */
        interface ICacheItem {

            /** CacheItem variableName */
            variableName?: (string|null);

            /** CacheItem job */
            job?: (IOracleJob|null);
        }

        /** Represents a CacheItem. */
        class CacheItem implements ICacheItem {

            /**
             * Constructs a new CacheItem.
             * @param [properties] Properties to set
             */
            constructor(properties?: OracleJob.CacheTask.ICacheItem);

            /** CacheItem variableName. */
            public variableName: string;

            /** CacheItem job. */
            public job?: (IOracleJob|null);

            /**
             * Creates a new CacheItem instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CacheItem instance
             */
            public static create(properties?: OracleJob.CacheTask.ICacheItem): OracleJob.CacheTask.CacheItem;

            /**
             * Encodes the specified CacheItem message. Does not implicitly {@link OracleJob.CacheTask.CacheItem.verify|verify} messages.
             * @param message CacheItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: OracleJob.CacheTask.ICacheItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CacheItem message, length delimited. Does not implicitly {@link OracleJob.CacheTask.CacheItem.verify|verify} messages.
             * @param message CacheItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: OracleJob.CacheTask.ICacheItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CacheItem message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CacheItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.CacheTask.CacheItem;

            /**
             * Decodes a CacheItem message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CacheItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.CacheTask.CacheItem;

            /**
             * Verifies a CacheItem message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CacheItem message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CacheItem
             */
            public static fromObject(object: { [k: string]: any }): OracleJob.CacheTask.CacheItem;

            /**
             * Creates a plain object from a CacheItem message. Also converts values to other types if specified.
             * @param message CacheItem
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: OracleJob.CacheTask.CacheItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CacheItem to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of a SysclockOffsetTask. */
    interface ISysclockOffsetTask {
    }

    /** Represents a SysclockOffsetTask. */
    class SysclockOffsetTask implements ISysclockOffsetTask {

        /**
         * Constructs a new SysclockOffsetTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ISysclockOffsetTask);

        /**
         * Creates a new SysclockOffsetTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SysclockOffsetTask instance
         */
        public static create(properties?: OracleJob.ISysclockOffsetTask): OracleJob.SysclockOffsetTask;

        /**
         * Encodes the specified SysclockOffsetTask message. Does not implicitly {@link OracleJob.SysclockOffsetTask.verify|verify} messages.
         * @param message SysclockOffsetTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ISysclockOffsetTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SysclockOffsetTask message, length delimited. Does not implicitly {@link OracleJob.SysclockOffsetTask.verify|verify} messages.
         * @param message SysclockOffsetTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ISysclockOffsetTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SysclockOffsetTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SysclockOffsetTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.SysclockOffsetTask;

        /**
         * Decodes a SysclockOffsetTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SysclockOffsetTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.SysclockOffsetTask;

        /**
         * Verifies a SysclockOffsetTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SysclockOffsetTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SysclockOffsetTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.SysclockOffsetTask;

        /**
         * Creates a plain object from a SysclockOffsetTask message. Also converts values to other types if specified.
         * @param message SysclockOffsetTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.SysclockOffsetTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SysclockOffsetTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MarinadeStateTask. */
    interface IMarinadeStateTask {
    }

    /** Represents a MarinadeStateTask. */
    class MarinadeStateTask implements IMarinadeStateTask {

        /**
         * Constructs a new MarinadeStateTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IMarinadeStateTask);

        /**
         * Creates a new MarinadeStateTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MarinadeStateTask instance
         */
        public static create(properties?: OracleJob.IMarinadeStateTask): OracleJob.MarinadeStateTask;

        /**
         * Encodes the specified MarinadeStateTask message. Does not implicitly {@link OracleJob.MarinadeStateTask.verify|verify} messages.
         * @param message MarinadeStateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IMarinadeStateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MarinadeStateTask message, length delimited. Does not implicitly {@link OracleJob.MarinadeStateTask.verify|verify} messages.
         * @param message MarinadeStateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IMarinadeStateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MarinadeStateTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MarinadeStateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.MarinadeStateTask;

        /**
         * Decodes a MarinadeStateTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MarinadeStateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.MarinadeStateTask;

        /**
         * Verifies a MarinadeStateTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MarinadeStateTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MarinadeStateTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.MarinadeStateTask;

        /**
         * Creates a plain object from a MarinadeStateTask message. Also converts values to other types if specified.
         * @param message MarinadeStateTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.MarinadeStateTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MarinadeStateTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SolanaAccountDataFetchTask. */
    interface ISolanaAccountDataFetchTask {

        /** SolanaAccountDataFetchTask pubkey */
        pubkey?: (string|null);
    }

    /** Represents a SolanaAccountDataFetchTask. */
    class SolanaAccountDataFetchTask implements ISolanaAccountDataFetchTask {

        /**
         * Constructs a new SolanaAccountDataFetchTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ISolanaAccountDataFetchTask);

        /** SolanaAccountDataFetchTask pubkey. */
        public pubkey: string;

        /**
         * Creates a new SolanaAccountDataFetchTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SolanaAccountDataFetchTask instance
         */
        public static create(properties?: OracleJob.ISolanaAccountDataFetchTask): OracleJob.SolanaAccountDataFetchTask;

        /**
         * Encodes the specified SolanaAccountDataFetchTask message. Does not implicitly {@link OracleJob.SolanaAccountDataFetchTask.verify|verify} messages.
         * @param message SolanaAccountDataFetchTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ISolanaAccountDataFetchTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SolanaAccountDataFetchTask message, length delimited. Does not implicitly {@link OracleJob.SolanaAccountDataFetchTask.verify|verify} messages.
         * @param message SolanaAccountDataFetchTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ISolanaAccountDataFetchTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SolanaAccountDataFetchTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SolanaAccountDataFetchTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.SolanaAccountDataFetchTask;

        /**
         * Decodes a SolanaAccountDataFetchTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SolanaAccountDataFetchTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.SolanaAccountDataFetchTask;

        /**
         * Verifies a SolanaAccountDataFetchTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SolanaAccountDataFetchTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SolanaAccountDataFetchTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.SolanaAccountDataFetchTask;

        /**
         * Creates a plain object from a SolanaAccountDataFetchTask message. Also converts values to other types if specified.
         * @param message SolanaAccountDataFetchTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.SolanaAccountDataFetchTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SolanaAccountDataFetchTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CronParseTask. */
    interface ICronParseTask {

        /** CronParseTask cronPattern */
        cronPattern?: (string|null);

        /** CronParseTask clockOffset */
        clockOffset?: (number|null);

        /** CronParseTask clock */
        clock?: (OracleJob.CronParseTask.ClockType|null);
    }

    /** Represents a CronParseTask. */
    class CronParseTask implements ICronParseTask {

        /**
         * Constructs a new CronParseTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ICronParseTask);

        /** CronParseTask cronPattern. */
        public cronPattern: string;

        /** CronParseTask clockOffset. */
        public clockOffset: number;

        /** CronParseTask clock. */
        public clock: OracleJob.CronParseTask.ClockType;

        /**
         * Creates a new CronParseTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CronParseTask instance
         */
        public static create(properties?: OracleJob.ICronParseTask): OracleJob.CronParseTask;

        /**
         * Encodes the specified CronParseTask message. Does not implicitly {@link OracleJob.CronParseTask.verify|verify} messages.
         * @param message CronParseTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ICronParseTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CronParseTask message, length delimited. Does not implicitly {@link OracleJob.CronParseTask.verify|verify} messages.
         * @param message CronParseTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ICronParseTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CronParseTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CronParseTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.CronParseTask;

        /**
         * Decodes a CronParseTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CronParseTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.CronParseTask;

        /**
         * Verifies a CronParseTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CronParseTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CronParseTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.CronParseTask;

        /**
         * Creates a plain object from a CronParseTask message. Also converts values to other types if specified.
         * @param message CronParseTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.CronParseTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CronParseTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace CronParseTask {

        /** ClockType enum. */
        enum ClockType {
            ORACLE = 0,
            SYSCLOCK = 1
        }
    }

    /** Properties of a BufferLayoutParseTask. */
    interface IBufferLayoutParseTask {

        /** BufferLayoutParseTask offset */
        offset?: (number|null);

        /** BufferLayoutParseTask endian */
        endian?: (OracleJob.BufferLayoutParseTask.Endian|null);

        /** BufferLayoutParseTask type */
        type?: (OracleJob.BufferLayoutParseTask.BufferParseType|null);
    }

    /** Represents a BufferLayoutParseTask. */
    class BufferLayoutParseTask implements IBufferLayoutParseTask {

        /**
         * Constructs a new BufferLayoutParseTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IBufferLayoutParseTask);

        /** BufferLayoutParseTask offset. */
        public offset: number;

        /** BufferLayoutParseTask endian. */
        public endian: OracleJob.BufferLayoutParseTask.Endian;

        /** BufferLayoutParseTask type. */
        public type: OracleJob.BufferLayoutParseTask.BufferParseType;

        /**
         * Creates a new BufferLayoutParseTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BufferLayoutParseTask instance
         */
        public static create(properties?: OracleJob.IBufferLayoutParseTask): OracleJob.BufferLayoutParseTask;

        /**
         * Encodes the specified BufferLayoutParseTask message. Does not implicitly {@link OracleJob.BufferLayoutParseTask.verify|verify} messages.
         * @param message BufferLayoutParseTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IBufferLayoutParseTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BufferLayoutParseTask message, length delimited. Does not implicitly {@link OracleJob.BufferLayoutParseTask.verify|verify} messages.
         * @param message BufferLayoutParseTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IBufferLayoutParseTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BufferLayoutParseTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BufferLayoutParseTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.BufferLayoutParseTask;

        /**
         * Decodes a BufferLayoutParseTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BufferLayoutParseTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.BufferLayoutParseTask;

        /**
         * Verifies a BufferLayoutParseTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BufferLayoutParseTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BufferLayoutParseTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.BufferLayoutParseTask;

        /**
         * Creates a plain object from a BufferLayoutParseTask message. Also converts values to other types if specified.
         * @param message BufferLayoutParseTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.BufferLayoutParseTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BufferLayoutParseTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace BufferLayoutParseTask {

        /** Endian enum. */
        enum Endian {
            LITTLE_ENDIAN = 0,
            BIG_ENDIAN = 1
        }

        /** BufferParseType enum. */
        enum BufferParseType {
            pubkey = 1,
            bool = 2,
            u8 = 3,
            i8 = 4,
            u16 = 5,
            i16 = 6,
            u32 = 7,
            i32 = 8,
            f32 = 9,
            u64 = 10,
            i64 = 11,
            f64 = 12,
            u128 = 13,
            i128 = 14
        }
    }

    /** Properties of a Task. */
    interface ITask {

        /** Task httpTask */
        httpTask?: (OracleJob.IHttpTask|null);

        /** Task jsonParseTask */
        jsonParseTask?: (OracleJob.IJsonParseTask|null);

        /** Task medianTask */
        medianTask?: (OracleJob.IMedianTask|null);

        /** Task meanTask */
        meanTask?: (OracleJob.IMeanTask|null);

        /** Task websocketTask */
        websocketTask?: (OracleJob.IWebsocketTask|null);

        /** Task divideTask */
        divideTask?: (OracleJob.IDivideTask|null);

        /** Task multiplyTask */
        multiplyTask?: (OracleJob.IMultiplyTask|null);

        /** Task lpTokenPriceTask */
        lpTokenPriceTask?: (OracleJob.ILpTokenPriceTask|null);

        /** Task lpExchangeRateTask */
        lpExchangeRateTask?: (OracleJob.ILpExchangeRateTask|null);

        /** Task conditionalTask */
        conditionalTask?: (OracleJob.IConditionalTask|null);

        /** Task valueTask */
        valueTask?: (OracleJob.IValueTask|null);

        /** Task maxTask */
        maxTask?: (OracleJob.IMaxTask|null);

        /** Task regexExtractTask */
        regexExtractTask?: (OracleJob.IRegexExtractTask|null);

        /** Task xstepPriceTask */
        xstepPriceTask?: (OracleJob.IXStepPriceTask|null);

        /** Task addTask */
        addTask?: (OracleJob.IAddTask|null);

        /** Task subtractTask */
        subtractTask?: (OracleJob.ISubtractTask|null);

        /** Task twapTask */
        twapTask?: (OracleJob.ITwapTask|null);

        /** Task serumSwapTask */
        serumSwapTask?: (OracleJob.ISerumSwapTask|null);

        /** Task powTask */
        powTask?: (OracleJob.IPowTask|null);

        /** Task lendingRateTask */
        lendingRateTask?: (OracleJob.ILendingRateTask|null);

        /** Task mangoPerpMarketTask */
        mangoPerpMarketTask?: (OracleJob.IMangoPerpMarketTask|null);

        /** Task jupiterSwapTask */
        jupiterSwapTask?: (OracleJob.IJupiterSwapTask|null);

        /** Task perpMarketTask */
        perpMarketTask?: (OracleJob.IPerpMarketTask|null);

        /** Task oracleTask */
        oracleTask?: (OracleJob.IOracleTask|null);

        /** Task anchorFetchTask */
        anchorFetchTask?: (OracleJob.IAnchorFetchTask|null);

        /** Task defiKingdomsTask */
        defiKingdomsTask?: (OracleJob.IDefiKingdomsTask|null);

        /** Task tpsTask */
        tpsTask?: (OracleJob.ITpsTask|null);

        /** Task splStakePoolTask */
        splStakePoolTask?: (OracleJob.ISplStakePoolTask|null);

        /** Task splTokenParseTask */
        splTokenParseTask?: (OracleJob.ISplTokenParseTask|null);

        /** Task uniswapExchangeRateTask */
        uniswapExchangeRateTask?: (OracleJob.IUniswapExchangeRateTask|null);

        /** Task sushiswapExchangeRateTask */
        sushiswapExchangeRateTask?: (OracleJob.ISushiswapExchangeRateTask|null);

        /** Task pancakeswapExchangeRateTask */
        pancakeswapExchangeRateTask?: (OracleJob.IPancakeswapExchangeRateTask|null);

        /** Task cacheTask */
        cacheTask?: (OracleJob.ICacheTask|null);

        /** Task sysclockOffsetTask */
        sysclockOffsetTask?: (OracleJob.ISysclockOffsetTask|null);

        /** Task marinadeStateTask */
        marinadeStateTask?: (OracleJob.IMarinadeStateTask|null);

        /** Task solanaAccountDataFetchTask */
        solanaAccountDataFetchTask?: (OracleJob.ISolanaAccountDataFetchTask|null);

        /** Task bufferLayoutParseTask */
        bufferLayoutParseTask?: (OracleJob.IBufferLayoutParseTask|null);

        /** Task cronParseTask */
        cronParseTask?: (OracleJob.ICronParseTask|null);
    }

    /** Represents a Task. */
    class Task implements ITask {

        /**
         * Constructs a new Task.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ITask);

        /** Task httpTask. */
        public httpTask?: (OracleJob.IHttpTask|null);

        /** Task jsonParseTask. */
        public jsonParseTask?: (OracleJob.IJsonParseTask|null);

        /** Task medianTask. */
        public medianTask?: (OracleJob.IMedianTask|null);

        /** Task meanTask. */
        public meanTask?: (OracleJob.IMeanTask|null);

        /** Task websocketTask. */
        public websocketTask?: (OracleJob.IWebsocketTask|null);

        /** Task divideTask. */
        public divideTask?: (OracleJob.IDivideTask|null);

        /** Task multiplyTask. */
        public multiplyTask?: (OracleJob.IMultiplyTask|null);

        /** Task lpTokenPriceTask. */
        public lpTokenPriceTask?: (OracleJob.ILpTokenPriceTask|null);

        /** Task lpExchangeRateTask. */
        public lpExchangeRateTask?: (OracleJob.ILpExchangeRateTask|null);

        /** Task conditionalTask. */
        public conditionalTask?: (OracleJob.IConditionalTask|null);

        /** Task valueTask. */
        public valueTask?: (OracleJob.IValueTask|null);

        /** Task maxTask. */
        public maxTask?: (OracleJob.IMaxTask|null);

        /** Task regexExtractTask. */
        public regexExtractTask?: (OracleJob.IRegexExtractTask|null);

        /** Task xstepPriceTask. */
        public xstepPriceTask?: (OracleJob.IXStepPriceTask|null);

        /** Task addTask. */
        public addTask?: (OracleJob.IAddTask|null);

        /** Task subtractTask. */
        public subtractTask?: (OracleJob.ISubtractTask|null);

        /** Task twapTask. */
        public twapTask?: (OracleJob.ITwapTask|null);

        /** Task serumSwapTask. */
        public serumSwapTask?: (OracleJob.ISerumSwapTask|null);

        /** Task powTask. */
        public powTask?: (OracleJob.IPowTask|null);

        /** Task lendingRateTask. */
        public lendingRateTask?: (OracleJob.ILendingRateTask|null);

        /** Task mangoPerpMarketTask. */
        public mangoPerpMarketTask?: (OracleJob.IMangoPerpMarketTask|null);

        /** Task jupiterSwapTask. */
        public jupiterSwapTask?: (OracleJob.IJupiterSwapTask|null);

        /** Task perpMarketTask. */
        public perpMarketTask?: (OracleJob.IPerpMarketTask|null);

        /** Task oracleTask. */
        public oracleTask?: (OracleJob.IOracleTask|null);

        /** Task anchorFetchTask. */
        public anchorFetchTask?: (OracleJob.IAnchorFetchTask|null);

        /** Task defiKingdomsTask. */
        public defiKingdomsTask?: (OracleJob.IDefiKingdomsTask|null);

        /** Task tpsTask. */
        public tpsTask?: (OracleJob.ITpsTask|null);

        /** Task splStakePoolTask. */
        public splStakePoolTask?: (OracleJob.ISplStakePoolTask|null);

        /** Task splTokenParseTask. */
        public splTokenParseTask?: (OracleJob.ISplTokenParseTask|null);

        /** Task uniswapExchangeRateTask. */
        public uniswapExchangeRateTask?: (OracleJob.IUniswapExchangeRateTask|null);

        /** Task sushiswapExchangeRateTask. */
        public sushiswapExchangeRateTask?: (OracleJob.ISushiswapExchangeRateTask|null);

        /** Task pancakeswapExchangeRateTask. */
        public pancakeswapExchangeRateTask?: (OracleJob.IPancakeswapExchangeRateTask|null);

        /** Task cacheTask. */
        public cacheTask?: (OracleJob.ICacheTask|null);

        /** Task sysclockOffsetTask. */
        public sysclockOffsetTask?: (OracleJob.ISysclockOffsetTask|null);

        /** Task marinadeStateTask. */
        public marinadeStateTask?: (OracleJob.IMarinadeStateTask|null);

        /** Task solanaAccountDataFetchTask. */
        public solanaAccountDataFetchTask?: (OracleJob.ISolanaAccountDataFetchTask|null);

        /** Task bufferLayoutParseTask. */
        public bufferLayoutParseTask?: (OracleJob.IBufferLayoutParseTask|null);

        /** Task cronParseTask. */
        public cronParseTask?: (OracleJob.ICronParseTask|null);

        /** Task Task. */
        public Task?: ("httpTask"|"jsonParseTask"|"medianTask"|"meanTask"|"websocketTask"|"divideTask"|"multiplyTask"|"lpTokenPriceTask"|"lpExchangeRateTask"|"conditionalTask"|"valueTask"|"maxTask"|"regexExtractTask"|"xstepPriceTask"|"addTask"|"subtractTask"|"twapTask"|"serumSwapTask"|"powTask"|"lendingRateTask"|"mangoPerpMarketTask"|"jupiterSwapTask"|"perpMarketTask"|"oracleTask"|"anchorFetchTask"|"defiKingdomsTask"|"tpsTask"|"splStakePoolTask"|"splTokenParseTask"|"uniswapExchangeRateTask"|"sushiswapExchangeRateTask"|"pancakeswapExchangeRateTask"|"cacheTask"|"sysclockOffsetTask"|"marinadeStateTask"|"solanaAccountDataFetchTask"|"bufferLayoutParseTask"|"cronParseTask");

        /**
         * Creates a new Task instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Task instance
         */
        public static create(properties?: OracleJob.ITask): OracleJob.Task;

        /**
         * Encodes the specified Task message. Does not implicitly {@link OracleJob.Task.verify|verify} messages.
         * @param message Task message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ITask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Task message, length delimited. Does not implicitly {@link OracleJob.Task.verify|verify} messages.
         * @param message Task message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ITask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Task message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Task
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.Task;

        /**
         * Decodes a Task message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Task
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.Task;

        /**
         * Verifies a Task message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Task message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Task
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.Task;

        /**
         * Creates a plain object from a Task message. Also converts values to other types if specified.
         * @param message Task
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.Task, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Task to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
