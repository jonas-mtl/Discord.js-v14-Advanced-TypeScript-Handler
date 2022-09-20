import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export default model(
  'PremiumGuildsDB',
  new Schema({
    GuildID: String,
    PremiumStart: String,
    PremiumEnd: String
  })
);
