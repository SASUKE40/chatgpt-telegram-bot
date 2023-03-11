import {logWithTime} from './utils';

import {Configuration, OpenAIApi} from 'openai';
import {APIOptions} from './types';

class OpenAI {
  debug: number;
  readonly apiType: string;
  protected _opts: APIOptions;
  protected _timeoutMs: number | undefined;
  protected _openai: OpenAIApi | undefined;

  constructor(apiOpts: APIOptions, debug = 1) {
    this.debug = debug;
    this.apiType = apiOpts.type;
    this._opts = apiOpts;
    this._timeoutMs = undefined;
    this._openai = undefined;
  }

  init = async () => {
    if (!this._opts.official) {
      throw new RangeError('Invalid official config');
    }
    const {apiKey} = this._opts.official;
    if (apiKey) {
      const configuration = new Configuration({
        apiKey: this._opts.official?.apiKey,
      });
      this._openai = new OpenAIApi(configuration);
    } else {
      throw new RangeError('Invalid API type');
    }
    logWithTime('🔮 OpenAI API has started...');
  };

  generateImage = async (text: string) => {
    if (!this._openai) {
      throw new Error('⛔️ OpenAI API is not initialized');
    }
    const response = await this._openai.createImage({
      prompt: text,
      n: 1,
      size: '512x512',
      response_format: 'url',
    });
    const imageUrl = response?.data?.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('⛔️ Generated image is not found');
    }
    return imageUrl;
  };
}

export {OpenAI};
