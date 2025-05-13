import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import FormData from 'form-data';

export interface IdeogramStyleReference {
  urls?: string[];
  style_code?: string;
  random_style?: boolean;
}

export interface IdeogramGenerateParams {
  prompt: string;
  aspect_ratio?: string;
  model?: 'V_1' | 'V_1_TURBO' | 'V_2' | 'V_2_TURBO' | 'V_3' | 'V_3_TURBO' | 'V_3_DEFAULT' | 'V_3_QUALITY';
  magic_prompt_option?: 'AUTO' | 'ON' | 'OFF';
  seed?: number;
  style_type?: string;
  negative_prompt?: string;
  num_images?: number;
  resolution?: string;
  color_palette?: {
    name?: string;
    members?: Array<{ color: string; weight?: number }>;
  };
  style_reference?: IdeogramStyleReference;
}

export interface IdeogramResponse {
  created: string;
  data: Array<{
    url: string;
    id: string;
    filepath?: string;
  }>;
}

export class IdeogramClient {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.ideogram.ai';
  private readonly outputDir: string;

  constructor(apiKey: string, outputDir?: string) {
    if (!apiKey) {
      throw new Error('IDEOGRAM_API_KEY is required');
    }
    this.apiKey = apiKey;
    this.outputDir = outputDir || process.env.IDEOGRAM_OUTPUT_DIR || path.join(process.cwd(), 'generated_images');
    
    // 出力ディレクトリが存在しない場合は作成
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  private async downloadImage(url: string, id: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}_${id}.png`;
    const filepath = path.join(this.outputDir, filename);

    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(filepath);
        });
        fileStream.on('error', reject);
      }).on('error', reject);
    });
  }

  async generateImage(params: IdeogramGenerateParams): Promise<IdeogramResponse> {
    try {
      // 参照画像がURLとして提供されている場合
      let formData: any = undefined;
      let requestConfig: any = {
        headers: {
          'Api-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
      };
      
      // style_referenceでurlsが指定されている場合はマルチパートフォームデータを使用
      if (params.style_reference?.urls && params.style_reference.urls.length > 0) {
        formData = new FormData();
        
        // 参照画像をダウンロードしてFormDataに追加
        for (let i = 0; i < params.style_reference.urls.length; i++) {
          const url = params.style_reference.urls[i];
          try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            formData.append(`reference_image_${i+1}`, buffer, `reference_${i+1}.jpg`);
          } catch (error) {
            console.error(`Failed to download reference image from ${url}:`, error);
          }
        }
        
        // その他のパラメータをJSON文字列としてFormDataに追加
        const paramsWithoutStyleReferenceUrls = {
          ...params,
          style_reference: {
            ...params.style_reference,
            urls: undefined // URLsを無効化して重複を避ける
          }
        };
        formData.append('image_request', JSON.stringify(paramsWithoutStyleReferenceUrls));
        
        // FormDataを使用するためのヘッダー設定
        requestConfig.headers['Content-Type'] = 'multipart/form-data';
      }
      
      // 通常のJSONリクエストまたはFormDataリクエストを送信
      const response = await axios.post(
        `${this.baseUrl}/api/v3/generate`,
        formData || { image_request: params },
        requestConfig
      );

      // 画像を自動保存
      const downloadPromises = response.data.data.map(async (img: { url: string; id: string }) => {
        const filepath = await this.downloadImage(img.url, img.id);
        return { ...img, filepath };
      });
      
      const updatedData = await Promise.all(downloadPromises);
      response.data.data = updatedData;

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Ideogram API error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }
}
