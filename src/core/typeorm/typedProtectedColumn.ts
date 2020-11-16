import { Emptyable, Json } from '@utils/types';
import { InputFrom, InputTo } from './types';

export class TypedProtectedColumn {
  private value?: string | null;
  private isValueDecoded = false;
  protected input: InputFrom | InputTo;

  public static from(data: Emptyable<Json>, decoder: (data: Emptyable<Json>) => Emptyable<string>) {
    return new TypedProtectedColumn({ type: 'from', data, decoder });
  }

  public static to(value: Emptyable<string>) {
    return new TypedProtectedColumn({ type: 'to', value });
  }

  public constructor(input: InputFrom | InputTo) {
    this.input = input;
    if (input.type === 'to') {
      this.setValue(input.value);
    }
  }

  public getPayload() {
    const input = this.getInput();

    if (input.type === 'to' || this.getIsValueDecoded()) {
      return this.getValue();
    }

    const { data, decoder } = input;

    if (!data) {
      return data;
    }

    const decodedData = decoder(data);

    this.setIsValueDecoded();
    this.setValue(decodedData);

    return decodedData;
  }

  public getFromDataIfExists() {
    const input = this.getInput();

    if (input.type === 'from') {
      return input.data;
    }

    throw new Error('No from data available');
  }

  public getValue() {
    return this.value;
  }

  public setValue(value: Emptyable<string>) {
    this.value = value;
    return this;
  }

  protected getInput() {
    return this.input;
  }

  private setIsValueDecoded() {
    this.isValueDecoded = true;
    return this;
  }

  private getIsValueDecoded() {
    return this.isValueDecoded;
  }
}
