import { Info, Calendar, Tag, Percent } from 'lucide-react';
import { ComboDetailsSectionProps } from './types';

export default function ComboDetailsSection({ combo }: ComboDetailsSectionProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-red-500" />
                Combo Details
            </h3>
            
            <div className="space-y-6">
                {/* Description */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600 leading-relaxed">
                        {combo.description || 'No detailed description available for this combo.'}
                    </p>
                </div>

                {/* Combo Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Combo ID */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-700">Combo ID</span>
                        </div>
                        <span className="text-gray-900 font-mono text-sm">
                            {combo.combo_id}
                        </span>
                    </div>

                    {/* Offer Percentage */}
                    {combo.offer_percentage && (
                        <div className="bg-red-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Percent className="w-4 h-4 text-red-500" />
                                <span className="font-medium text-red-700">Discount</span>
                            </div>
                            <span className="text-red-900 font-semibold">
                                {combo.offer_percentage}% OFF
                            </span>
                        </div>
                    )}

                    {/* Created Date */}
                    {combo.created_date && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span className="font-medium text-blue-700">Created</span>
                            </div>
                            <span className="text-blue-900">
                                {new Date(combo.created_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    )}

                    {/* Status */}
                    <div className={`p-4 rounded-lg ${combo.is_enabled ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-4 h-4 rounded-full ${combo.is_enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={`font-medium ${combo.is_enabled ? 'text-green-700' : 'text-red-700'}`}>
                                Status
                            </span>
                        </div>
                        <span className={`font-semibold ${combo.is_enabled ? 'text-green-900' : 'text-red-900'}`}>
                            {combo.is_enabled ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                </div>

                {/* Products Count */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">What's Included</h4>
                    <p className="text-yellow-700">
                        This combo includes <strong>{combo.products?.length || 0}</strong> carefully selected items 
                        that complement each other perfectly, offering you great value and a complete meal experience.
                    </p>
                </div>

                {/* Additional Information */}
                <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Important Notes</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>All items in this combo are served together as a complete meal.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Individual items cannot be substituted or removed from the combo.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Combo pricing is only valid when all items are ordered together.</span>
                        </li>
                        {combo.offer_percentage && (
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>Special {combo.offer_percentage}% discount is already applied to the combo price.</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
