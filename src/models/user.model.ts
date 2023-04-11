import {
  prop,
  index,
  pre,
  modelOptions,
  getModelForClass,
} from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';

// Make email field have index
@index({ email: 1 })
@pre<User>('save', async function () {
  // Hash password if new or update
  if (!this.isModified('password')) return;

  // Hash password
  this.password = await bcrypt.hash(this.password, 12);
})
@modelOptions({
  schemaOptions: {
    // Add createAt and updateAt fields
    timestamps: true,
  },
})

/* User class */
export class User {
  @prop({ required: true })
  public name!: string;

  @prop({ unique: true, required: true })
  public email!: string;

  @prop({ required: true, minlength: 8, maxlength: 32, select: false })
  password!: string;

  @prop({ default: 'user' })
  role!: string;

  // Check password match or not
  async comparePasswords(hashPassword: string, password: string) {
    return await bcrypt.compare(password, hashPassword);
  }
}

// Create the user model
const userModel = getModelForClass(User);
export default userModel;
